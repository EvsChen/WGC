/**
* @file: server.js
* @author: EvsChen
*/

const path = require('path');
const http = require('http');
const express = require('express');

const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_CONNECT = 'controller_connect';
const CONTROLLER_CONNECTED = 'controller_connected';
const CONTROLLER_ALL_CONNECTED = 'controller_all_connected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';
const DISCONNECT = 'disconnect';

const app = express();

app.get('/pingpong', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'pingpong.html'));
});
app.use('/', express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const server = new http.Server(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

// the part below handles the socket connection
const io = require('socket.io').listen(server);
const gameSockets = {};
const controllerSockets = {};
io.sockets.on('connection', (socket) => {
  socket.on(GAME_CONNECT, onGameConnect);
  socket.on(CONTROLLER_CONNECT, onControllerConnect);
  socket.on(DISCONNECT, onDisconnect);

  /**
   * @param {object} gameInfo - info of the game
   */
  function onGameConnect(gameInfo) {
    console.log('Game trying to connect');
    if (!gameInfo) {
      console.error('Missing game info');
      return;
    }
    console.log(`Game ${gameInfo.gameId}: ${socket.id} connected`);
    gameSockets[socket.id] = {
      socket,
      gameId: gameInfo.gameId,
      numOfPlayer: gameInfo.numOfPlayer || 1,
      controllers: [],
    };
    socket.emit(GAME_CONNECTED);
  };

  /**
   * listener for controller connect
   * @param {string} gameSocketId
   */
  function onControllerConnect(gameSocketId) {
    console.log('Controller trying to connect...');
    // if no such game exists
    if (!gameSockets[gameSocketId]) {
      console.log(`The corresponding game ${gameSocketId} does not exist`);
      socket.emit(CONTROLLER_CONNECTED, false);
      return;
    }
    controllerSockets[socket.id] = {socket, gameSocketId};

    const {
      controllers,
      socket: gameSocket,
      numOfPlayer,
    } = gameSockets[gameSocketId];

    if (controllers.length < numOfPlayer) {
      controllers.push(socket.id);
      gameSocket.emit(CONTROLLER_CONNECTED, true);
      console.log('Controller connected successfully');
      socket.on(CONTROLLER_STATE_CHANGE, (state) => {
        console.log('Received state change', state);
        gameSocket.emit(CONTROLLER_STATE_CHANGE, state);
      });
    } else if (controllers.length === numOfPlayer) {
      // all controllers connected
      gameSocket.emit(CONTROLLER_ALL_CONNECTED);
    } else {
      // more controllers than needed
      console.log('Controller tries to connect but failed: more controllers than expected');
      socket.emit(CONTROLLER_CONNECTED, false);
    }
  };

  /**
   * on disconnect
   */
  function onDisconnect() {
    if (gameSockets[socket.id]) {
      console.log('Game disconnected');
      const disconnectedGame = gameSockets[socket.id];
      if (controllerSockets[disconnectedGame.controllerId]) {
        const disconnectedController = controllerSockets[disconnectedGame.controllerId];
        disconnectedController.socket.emit(CONTROLLER_CONNECTED, false);
        disconnectedController.gameSocketId = '';
      }
      delete gameSockets[socket.id];
    } else if (controllerSockets[socket.id]) {
      console.log('Controller disconnected');
      const disconnectedController = controllerSockets[socket.id];
      if (gameSockets[disconnectedController.gameSocketId]) {
        const {
          controllers,
          socket: gameSocket,
        } = gameSockets[disconnectedController.gameSocketId];
        // remove the controller from the arr
        controllers.splice(controllers.indexOf(socket.id), 1);
        gameSocket.emit(CONTROLLER_CONNECTED, false);
        gameSocket.emit('controller_disconnected');
      }
      delete controllerSockets[socket.id];
    }
  };
});
