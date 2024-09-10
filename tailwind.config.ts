import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', "sans-serif"],
        display: ['"Poppins"', "sans-serif"],
        bungee: ['"Bungee"', "sans-serif"],
        anton: ['"Anton"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
      },
      colors: {
        darkBlue: "#111928",
        midBlue: "#1F2A37",
        gold: "#b6c0cc", // #ffc300
        lightGold: "#ffd60a ", //#ffd60a #E6EBF1 #5750F1
        dark: "#000814",
        energyStart: "#34d399",
        energyEnd: "#10b981",
        healthStart: "#34d399",
        healthEnd: "#10b981",
      },
    },
  },
  plugins: [],
};

export default config;
