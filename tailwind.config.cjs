/** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ["class"],
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./App.tsx"],
      theme: {
        extend: {
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(24, 95%, 53%)', // Warm Orange/Red for food
              foreground: 'hsl(0, 0%, 100%)'
            },
            secondary: {
              DEFAULT: 'hsl(24, 10%, 96%)',
              foreground: 'hsl(24, 95%, 10%)'
            },
            accent: {
              DEFAULT: 'hsl(45, 93%, 47%)', // Golden yellow
              foreground: 'hsl(0, 0%, 100%)'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Lora', 'serif'],
            mono: ['Space Mono', 'monospace']
          }
        }
      },
      plugins: [require("tailwindcss-animate")],
    };