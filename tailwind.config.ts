import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  darkMode: "class",

  jit: true,

  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      borderRadius: {
        card: "2rem",
      },

      colors: {
        accent: "#002f49",
        primary: "#f59e0b",
        olive: "#c4d29f",
        wheat: "#ffd29f",
      },
    },
  },
};
