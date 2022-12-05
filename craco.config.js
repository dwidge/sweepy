const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.externals = {
        three: "THREE",
      };
      return webpackConfig;
    },
    alias: {},
  },
};
