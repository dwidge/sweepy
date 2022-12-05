const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.externals = {
        three: "THREE",
        //'@tensorflow/tfjs': 'tf',
      };
      return webpackConfig;
    },
    alias: {},
  },
};
