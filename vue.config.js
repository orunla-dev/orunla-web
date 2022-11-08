const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;

module.exports = {
  pwa: {
    id: "Orunla",
    description:
      "Readers are leaders, we are on a mission to make everyone a leader.",
    categories: ["utilities", "productivity", "books", "education"],
    background_color: "#fff",
    name: "Orunla Africa",
    themeColor: "#fff",
    msTileColor: "#fff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "default",
    assetsVersion: version,
    workboxPluginMode: "InjectManifest",
    manifestOptions: {
      short_name: "Orunla",
    },
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/service-worker.js",
    },
  },
};
