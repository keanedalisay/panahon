const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    app: path.resolve(__dirname, "src/scripts/app.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  plugins: [new HTMLWebpackPlugin({ template: "src/index.temp.html" })],
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: { loader: "html-loader", options: { minimize: false } },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|eof|otf)$/i,
        type: "asset/resource",
        generator: { filename: "assets/fonts/[name][ext]" },
      },
      {
        test: /\.(jpeg|jpg|png|webp|svg)$/i,
        type: "asset/resource",
        generator: { filename: "assets/images/[name][ext]" },
      },
    ],
  },
};
