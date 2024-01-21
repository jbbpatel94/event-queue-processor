const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: 'EventQueueProcessor',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map', // Enable source maps for better debugging
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
}