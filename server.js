/**
* @file: server.js
* @author: EvsChen
*/

const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_CONNECT = 'controller_connect';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';
const DISCONNECT = 'disconnect';

const http = require('http');
const express = require('express');
const _ = require('lodash');

const app = express();
app.use('/', express.static('dist'));
app.use('/lib', express.static('lib'));
app.use('/assets', express.static('assets'));

const server = new http.Server(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

// the part below handles the socket connection
const io = require('socket.io').listen(server);
const gameSockets = {};
const controllerSockets = {};
io.sockets.on('connection', socket => {
    socket.on(GAME_CONNECT, gameInfo => {
        if (gameInfo) {
          console.log(`Game ${gameInfo.id} connected`);           
        }
        gameSockets[socket.id] = {
            socket,
            multi: gameInfo.multi,
            numOfPlayers: gameInfo.numOfPlayers || 1
        };
        console.log('Game connected');
        socket.emit(GAME_CONNECTED);
    });
    socket.on(CONTROLLER_CONNECT, gameSocketId => {
        // First determine whether the game exist
        if (gameSockets[gameSocketId]) {
            const gameSocketItem = gameSockets[gameSocketId];
            // Save the socket and game socket id
            controllerSockets[socket.id] = {
                socket,
                gameSocketId
            };

            // if controller succesfully connected
            function handleSuccess() {
                gameSocketItem.socket.emit('controller_connected', true);
                console.log('Controller connected successfully');
                socket.on(CONTROLLER_STATE_CHANGE, state => {
                    console.log(state);
                    if (gameSockets[gameSocketId]) {
                        gameSockets[gameSocketId].socket.emit(CONTROLLER_STATE_CHANGE, state);
                    }
                });
            }

            // If the controller array already exists
            if (_.isArray(gameSocketItem.controllers)) {
                const controllerArr = gameSocketItem.controllers;
                if (controllerArr.length < gameSocketItem.numOfPlayers) {
                    controllerArr.push(socket.id);
                    handleSuccess();
                } else {
                    console.log('Controller tries to connect but failed: more controllers than expected');
                    socket.emit('controller_connected', false);                    
                }
            } 
            // Else creates a new array
            else {
                gameSocketItem.controllers = [socket.id];
                handleSuccess();
            }
        } else {
            // if no such game exists
            console.log('Controller tries to connect but failed');
            console.log('The corresponding game does not exist');
            socket.emit('controller_connected', false);
        }
    });
    socket.on(DISCONNECT, () => {
        if (gameSockets[socket.id]) {
            console.log('Game disconnected');
            const disconnectedGame = gameSockets[socket.id];
            if (controllerSockets[disconnectedGame.controllerId]) {
                const disconnectedController = controllerSockets[disconnectedGame.controllerId];
                disconnectedController.socket.emit('controller_connected', false);
                disconnectedController.gameSocketId = '';
            }
            delete gameSockets[socket.id];
        }
        else if (controllerSockets[socket.id]) {
            console.log('Controller disconnected');
            const disconnectedController = controllerSockets[socket.id];
            if (gameSockets[disconnectedController.gameSocketId]) {
                const disconnectedGame = gameSockets[disconnectedController.gameSocketId];
                disconnectedGame.socket.emit('controller_connected', false);
                disconnectedGame.socket.emit('controller_disconnected');
                disconnectedGame.controllerId = '';
            }
            delete controllerSockets[socket.id];
        }
    });
});
