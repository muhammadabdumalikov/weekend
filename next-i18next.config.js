module.exports = {
  i18n: {
    defaultLocale: "ru",
    locales: ["en", "ru", "uz"],
    localeDetection: false, // Disable automatic locale detection
  },
  defaultNS: "common",
  localePath: typeof window === "undefined" ? require("path").resolve("./public/locales") : "/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
