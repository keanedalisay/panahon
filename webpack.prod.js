const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    app: path.resolve(__dirname, "src/scripts/app.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "[name].[contenthash].html",
      template: "src/index.temp.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/i,
        type: "asset/resource",
        generator: { filename: "assets/fonts/[name].[contenthash][ext]" },
      },
      {
        test: /\.(jpeg|jpg|png|svg|webp)$/i,
        type: "asset/resource",
        generator: { filename: "assets/images/[name].[contenthash][ext]" },
      },
    ],
  },
};
