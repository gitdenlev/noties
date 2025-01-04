// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  target: "static",
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: ["~/assets/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxt/image", "@nuxt/icon", "@nuxtjs/google-fonts"],
});