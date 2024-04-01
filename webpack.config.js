const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/js/app.js",
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/app.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        /*
        curlconverter
        Note this is patched. See:
        - https://github.com/curlconverter/curlconverter/issues/617
        - https://github.com/chris48s/jq-playground/commit/e082633b8d1384dc82c723d66e8212514c67ce12
        */
        { from: "node_modules/web-tree-sitter/tree-sitter.wasm", to: "js" },
        {
          from: "node_modules/curlconverter/dist/tree-sitter-bash.wasm",
          to: "js",
        },

        // jq-web
        {
          from: "jq.wasm.js",
          to: "js",
          context: "node_modules/jq-web",
        },
        {
          from: "jq.wasm.wasm",
          to: "js",
          context: "node_modules/jq-web",
        },

        // water
        { from: "node_modules/water.css/out/water.css", to: "css" },

        // project files
        { from: "*.html", to: "", context: "src" },
        { from: "src/css", to: "css" },
      ],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  // Don't warn that we have a big JS bundle.
  performance: { hints: false },
};
