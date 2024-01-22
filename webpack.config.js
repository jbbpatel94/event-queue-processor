const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: 'EventQueueProcessor',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map', // Enable source maps for better debugging
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
}