import os
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from sqlalchemy import CheckConstraint, Numeric, text
from sqlalchemy.exc import IntegrityError

db = SQLAlchemy()


class Customer(db.Model):
    __tablename__ = "customers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    phone = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=text("now()"))
    orders = db.relationship("Order", back_populates="customer")


class RestaurantTable(db.Model):
    __tablename__ = "restaurant_tables"
    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.Integer, nullable=False, unique=True)
    status = db.Column(db.Text, nullable=False, server_default="available")


class MenuItem(db.Model):
    __tablename__ = "menu_items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    price = db.Column(Numeric(10, 2), nullable=False)
    cuisine = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.Text)
    is_available = db.Column(db.Boolean, nullable=False, default=True)


class Order(db.Model):
    __tablename__ = "orders"
    __table_args__ = (CheckConstraint("status IN ('pending','preparing','ready','served','cancelled')"),)
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("restaurant_tables.id", ondelete="RESTRICT"), nullable=False)
    status = db.Column(db.Text, nullable=False, default="pending")
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=text("now()"))
    customer = db.relationship("Customer", back_populates="orders")
    table = db.relationship("RestaurantTable")
    items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(db.Model):
    __tablename__ = "order_items"
    __table_args__ = (CheckConstraint("quantity > 0"),)
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id", ondelete="RESTRICT"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    order = db.relationship("Order", back_populates="items")
    menu_item = db.relationship("MenuItem")


class Staff(db.Model):
    __tablename__ = "staff"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False, unique=True)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.Text, nullable=False)


def order_json(order):
    return {
        "id": order.id, "customer_name": order.customer.name,
        "table_number": order.table.table_number, "status": order.status,
        "created_at": order.created_at.isoformat(),
        "items": [{"name": row.menu_item.name, "quantity": row.quantity, "notes": row.notes,
                   "price": float(row.menu_item.price)} for row in order.items],
    }


def create_app():
    load_dotenv()
    app = Flask(__name__)
    database_url = os.environ.get("DATABASE_URL", "")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}
    db.init_app(app)
    origins = [origin.strip() for origin in os.environ.get("FRONTEND_ORIGINS", "*").split(",") if origin.strip()]
    CORS(app, resources={r"/api/*": {"origins": origins}})

    @app.get("/api/menu")
    def menu():
        grouped = {}
        for item in MenuItem.query.filter_by(is_available=True).order_by(MenuItem.cuisine, MenuItem.name):
            grouped.setdefault(item.cuisine, []).append({
                "id": item.id, "name": item.name, "description": item.description,
                "price": float(item.price), "image_url": item.image_url,
            })
        return jsonify(grouped)

    @app.post("/api/orders")
    def create_order():
        data = request.get_json(silent=True) or {}
        name, table_number, items = data.get("name"), data.get("table_number"), data.get("items")
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > 120:
            return jsonify(error="A customer name (up to 120 characters) is required."), 400
        if isinstance(table_number, bool) or not isinstance(table_number, int) or table_number < 1:
            return jsonify(error="table_number must be a positive integer."), 400
        if not isinstance(items, list) or not items:
            return jsonify(error="At least one item is required."), 400
        normalized = []
        for item in items:
            if not isinstance(item, dict) or isinstance(item.get("menu_item_id"), bool) or not isinstance(item.get("menu_item_id"), int) or item["menu_item_id"] < 1:
                return jsonify(error="Each item needs a valid menu_item_id."), 400
            quantity = item.get("quantity", 1)
            notes = item.get("notes", "")
            if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity < 1 or quantity > 99:
                return jsonify(error="Item quantity must be between 1 and 99."), 400
            if not isinstance(notes, str) or len(notes) > 500:
                return jsonify(error="Item notes must be 500 characters or fewer."), 400
            normalized.append((item["menu_item_id"], quantity, notes.strip() or None))

        table = RestaurantTable.query.filter_by(table_number=table_number).first()
        if not table:
            return jsonify(error="That table number does not exist."), 404
        menu_ids = {row[0] for row in normalized}
        menu_items = {item.id: item for item in MenuItem.query.filter(MenuItem.id.in_(menu_ids), MenuItem.is_available.is_(True)).all()}
        if len(menu_items) != len(menu_ids):
            return jsonify(error="One or more menu items are unavailable or unknown."), 400
        try:
            customer = Customer(name=name.strip(), phone=data.get("phone") if isinstance(data.get("phone"), str) else None)
            order = Order(customer=customer, table=table, status="pending")
            order.items = [OrderItem(menu_item_id=item_id, quantity=qty, notes=notes) for item_id, qty, notes in normalized]
            db.session.add(order)
            db.session.commit()
            return jsonify(order_json(order)), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify(error="Could not save the order."), 400

    @app.get("/api/orders")
    def list_orders():
        raw_status = request.args.get("status", "pending,preparing,ready")
        statuses = [part.strip() for part in raw_status.split(",") if part.strip()]
        allowed = {"pending", "preparing", "ready", "served", "cancelled"}
        if not statuses or any(status not in allowed for status in statuses):
            return jsonify(error="Invalid status filter."), 400
        orders = Order.query.filter(Order.status.in_(statuses)).order_by(Order.created_at.asc()).all()
        return jsonify([order_json(order) for order in orders])

    @app.patch("/api/orders/<int:order_id>/status")
    def update_status(order_id):
        data = request.get_json(silent=True) or {}
        status = data.get("status")
        if not isinstance(status, str) or status not in {"pending", "preparing", "ready", "served", "cancelled"}:
            return jsonify(error="Invalid order status."), 400
        order = db.session.get(Order, order_id)
        if not order:
            return jsonify(error="Order not found."), 404
        order.status = status
        order.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        return jsonify(order_json(order))

    @app.get("/api/health")
    def health():
        db.session.execute(text("SELECT 1"))
        return jsonify(status="ok")

    return app


app = create_app()
