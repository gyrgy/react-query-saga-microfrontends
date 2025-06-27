const path = require("path");
const { defineConfig } = require("@rspack/cli");
const { CopyRspackPlugin, HtmlRspackPlugin } = require("@rspack/core");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");

module.exports = (context, port) => {
  const isProduction = process.env.NODE_ENV === "production";
  const withRsDoctor = process.env.RSDOCTOR || false;
  const withSourceMaps = process.env.SOURCE_MAPS || false;

  const config = defineConfig({
    entry: {
      main: path.resolve(context, "./src/index.js"),
    },
    mode: !isProduction ? "development" : "production",
    resolve: {
      tsConfig: path.resolve(context, "./tsconfig.json"),
      alias: {
        src: path.resolve(context, "./src/"),
        shared: path.resolve(context, "../../shared/"),
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    experiments: {
      css: true,
    },
    module: {
      rules: [
        {
          test: /\.(j|t)s$/,
          exclude: [/[\\/]node_modules[\\/]/],
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
              },
              externalHelpers: false,
              transform: {
                react: {
                  runtime: "automatic",
                  development: !isProduction,
                  refresh: !isProduction,
                },
              },
            },
            env: {
              targets: {
                browsers: [">0.2%", "not dead", "not op_mini all"],
              },
            },
          },
        },
        {
          test: /\.(j|t)sx$/,
          loader: "builtin:swc-loader",
          exclude: [/[\\/]node_modules[\\/]/],
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                  development: !isProduction,
                  refresh: !isProduction,
                  pragma: "React.createElement",
                  pragmaFrag: "React.Fragment",
                  throwIfNamespace: true,
                  useBuiltins: false,
                },
              },
              externalHelpers: false,
            },
            env: {
              targets: {
                browsers: [">0.2%", "not dead", "not op_mini all"],
              },
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlRspackPlugin({
        template: path.resolve(context, "public/index.html"),
        minify: true,
      }),
      new CopyRspackPlugin({
        patterns: [
          { from: "public/favicon.png", to: "favicon.png" },
          { from: "public/robots.txt", to: "robots.txt" },
        ],
      }),
      ...(!isProduction ? [new ReactRefreshPlugin({ forceEnable: true })] : []),
      ...(withRsDoctor ? [new RsdoctorRspackPlugin({})] : []),
    ],
    devServer: {
      hot: true,
      host: "0.0.0.0",
      port,
      allowedHosts: "all",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
      compress: false,
      historyApiFallback: true,
      static: path.resolve(context, "build"),
      devMiddleware: { writeToDisk: true },
      client: {
        reconnect: 5,
      },
    },
    devtool: isProduction || withSourceMaps ? "source-map" : false,
    output: {
      path: path.join(context, "/build"),
      filename: isProduction
        ? "static/js/[name].[contenthash].js"
        : "static/js/[name].js",
      chunkFilename: isProduction
        ? "static/js/[name].[contenthash].chunk.js"
        : "static/js/[name].chunk.js",
      sourceMapFilename: isProduction
        ? "static/maps/[name].[contenthash].js.map"
        : "static/maps/[name].[id].js.map",
      cssFilename: isProduction
        ? "static/css/[name].[contenthash].css"
        : "static/css/[name].[id].css",
      cssChunkFilename: isProduction
        ? "static/css/[name].[contenthash].chunk.css"
        : "static/css/[name].[id].chunk.css",
      assetModuleFilename: isProduction
        ? "media/[name].[contenthash][ext]"
        : "media/[name][ext]",
      hotUpdateChunkFilename: isProduction
        ? "hot/[name].[fullhash].hot-update.js"
        : "hot/[name].hot-update.js",
      hotUpdateMainFilename: isProduction
        ? "hot/[runtime].[fullhash].hot-update.json"
        : "hot/[runtime].hot-update.json",
      clean: true,
      publicPath: "auto",
    },
    optimization: {
      minimize: !isProduction ? false : true,
    },
  });

  return config;
};
