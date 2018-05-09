const http = require('http');
const express = require('express');

const webpack = require('webpack');
const config = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const compiler = webpack(config);

const app = express();
// app.use('/', expres.static('app'));
app.use(webpackDevMiddleware(compiler,{
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(express.static('app'));

const server = new http.Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT);

io.on('connection', () => {
  console.log('Socket connected');
});