response = input("Would you like some food (Y/N)? ")
if response == "Y":
    print("What course would you like to have? ")
    print("Nigerian ")
    print("Continental ")
    print("Mexican ")
    print("Italian")
    food = input("What Course would you like to have? ")
    
    if food == "Nigerian":
        dish = input("What Nigerian dish would you like to have? Swallow Or Rice? ")
        if dish == "Swallow":
            print("Okay, What Swallow would you like to have? Fufu, Eba, Amala, Pounded Yam")
            swallow = input("Enter your choice: ")
            print(f"And what soup would you like to have with {swallow}?")
            soup = input("Enter your choice: ")
            print(f"Okay, you have chosen {swallow} with {soup}. It will arrive shortly")
        elif dish == "Rice":
            print("Okay, What Rice would you like to have? Jollof Rice, Fried Rice, White Rice")
            rice = input("Enter your choice: ")
            print(f"And what protein would you like to have with {rice}? Chicken, Beef, Fish")
            protein = input("Enter your choice: ")
            print(f"Okay, you have chosen {rice} with {protein}. It will arrive shortly")
    elif food == "Continental":
        print("Okay, What Continental dish would you like to have? Pasta, Pizza, Burger")
        continental = input("Enter your choice: ")
        print(f"And what protein would you like to have with {continental}? Chicken, Beef, Fish")
        protein = input("Enter your choice: ")
        print(f"Okay, you have chosen {continental} with {protein}. It will arrive shortly")
    elif food == "Mexican":
        print("Okay, What Mexican dish would you like to have? Tacos, Enchiladas, Burritos")
        mexican = input("Enter your choice: ")
        print(f"And what protein would you like to have with {mexican}? Chicken, Beef, Fish")
        protein = input("Enter your choice: ")
        print(f"Okay, you have chosen {mexican} with {protein}. It will arrive shortly")
    elif food == "Italian":
        print("Okay, What Italian dish would you like to have? Pasta, Pizza, Lasagna")
        italian = input("Enter your choice: ")
        print(f"And what protein would you like to have with {italian}? Chicken, Beef, Fish")
        protein = input("Enter your choice: ")
        print(f"Okay, you have chosen {italian} with {protein}. It will arrive shortly")
else:
    print("Tf you doing in a diner then? Get outta here!")
    