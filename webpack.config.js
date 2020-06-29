const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const glob = require("glob");

const themeOpts = require("./webpack/theme.config.json");

const makeCSSEntry = () => {
  const styleFiles = glob.sync("assets/styles/*.scss", {});
  const styleFilessRegExp = /^assets\/styles\/(.+)\.scss$/;

  return Object.assign(
    styleFiles.reduce((acc, path) => {
      const match = path.match(styleFilessRegExp)[1];
      acc[match] = `./${path}`;
      return acc;
    }, {})
  );
};

const getPluginProcess = env => {
  const isProduction = env.production === true;
  const isDevelopment = env.production !== true;
  let pluginList = [
    new CleanWebpackPlugin(),
    new BrowserSyncPlugin({
      https: true,
      host: "localhost",
      port: 3000,
      proxy: themeOpts.proxy,
      files: [
        {
          match: [],
          fn: function(event, file) {
            if (event === "change") {
              const bs = require("browser-sync").get("bs-webpack-plugin");
              bs.reload();
            }
          }
        }
      ]
    }),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: isProduction ? "styles/[name].css" : "styles/[name].css"
    })
  ];

  return pluginList;
};

module.exports = (env = {}) => {
  const isProduction = env.production === true;
  const isDevelopment = env.production !== true;
  let config = {
    entry: Object.assign(makeCSSEntry(), {}),
    output: {
      path: __dirname + "/dist/",
      publicPath: "../"
    },
    devtool: isProduction ? "" : "inline-source-map",
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          include: path.resolve(__dirname, "assets"),
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: { hmr: isDevelopment }
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: isDevelopment
              }
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: isDevelopment,
                config: {
                  path: "webpack/"
                }
              }
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  sourceMap: isDevelopment,
                  minimize: isProduction
                }
              }
            }
          ]
        }
      ]
    },
    plugins: getPluginProcess(env, this.entry),
    mode: isProduction ? "production" : "development"
  };
  return config;
};
