const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  // Entry can be an object containing multiple entry points
  entry: {
    game: "./src/index.js",
    welcome: "./src/welcome.js",
  },
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Battleship",
      template: "./src/index.html",
      scriptLoading: "blocking",
      filename: "game.html",
      chunks: ["game"],
    }),
    new HtmlWebpackPlugin({
      title: "Welcome to Battleship",
      template: "./src/welcome.html",
      scriptLoading: "blocking",
      filename: "index.html",
      chunks: ["welcome"],
    }),
  ],
  // Source map to identify source of errors
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      // For css files
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // For images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // Babel Loader
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
  },
};
