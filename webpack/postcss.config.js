const postcssConfig = {
  parser: "postcss-safe-parser",
  plugins: {
    "postcss-import": {},
    "postcss-cssnext": false,
    "cssnano":  {
      discardComments: {
        removeAll: true
      }
    }
  }
};

module.exports = postcssConfig;
