const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  watchOptions: {
    ignored: /node_moduels/,
  },
  mode: 'development',
  entry: {
    app: './src/index.js',
    pingpong: './pingpong/javascripts/app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties'],
        },
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      template: 'src/index.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['pingpong'],
      filename: 'pingpong.html',
      template: 'pingpong/index.html',
    }),
    new CopyWebpackPlugin(
        /** eslint-disable-next-line */
        ['animations', 'assets', 'audio', 'favicon', 'fonts', 'images', 'lib', 'stylesheets', 'models']
            .map((dir) => ({from: `./${dir}`, to: `${dir}`}))
    ),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};
