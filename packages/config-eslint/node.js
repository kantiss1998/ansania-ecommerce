const baseConfig = require("./index.js");

module.exports = {
  ...baseConfig,
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    ...baseConfig.rules,
    "no-console": "off", // Allow console in Node.js
  },
};
