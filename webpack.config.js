const path = require('path');
var PROD = process.env.NODE_ENV === 'production';
module.exports = {
  mode: PROD ? 'production' : 'development',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: PROD ? 'dyws.min.js' : 'dyws.js',
    library: 'dyws',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src')],
  },
  devtool: 'sourceMap',
};
