import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: false },

  devServer: {
    port: 3009,
  },

  ssr: false,

  app: {
    head: {
      title: "MBA With Arshi — Find the Right MBA College",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Practical MBA college shortlisting, entrance exam guidance, reviews and counselling with Arshi Khan.",
        },
        { property: "og:title", content: "MBA With Arshi — Find the Right MBA College" },
        { property: "og:description", content: "Practical MBA college shortlisting, entrance exam guidance, reviews and counselling with Arshi Khan." },
        { property: "og:type", content: "website" }
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;1,400;1,600&display=swap",
        },
      ],
    },
  },

  css: ["@/assets/css/main.css"],

  modules: ["@nuxtjs/tailwindcss"],
});
