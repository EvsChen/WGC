/**
* @file: server.js
* @author: EvsChen
*/

const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';

const http = require('http');
const express = require('express');
const _ = require('lodash');

const app = express();
app.use('/', express.static('app'));
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
        console.log(`Game ${gameInfo.id} connected`);
        gameSockets[socket.id] = {
            socket,
            multi: gameInfo.multi,
            numOfPlayers: gameInfo.numOfPlayers || 1
        };
        socket.emit(GAME_CONNECTED);
    });
    socket.on('controller_connect', SocketId => {
        // First determine whether the game exist
        if (gameSockets[SocketId]) {
            const gameSocketItem = gameSockets[SocketId];
            // Save the socket and game socket id
            controllerSockets[socket.id] = {
                socket,
                gameId: SocketId
            };

            function handleSuccess() {
                gameSocketItem.socket.emit('controller_connected', true);
                console.log('Controller connected successfully');
                socket.on(CONTROLLER_STATE_CHANGE, state => {
                    console.log(state);
                    if (gameSockets[SocketId]) {
                        gameSockets[SocketId].socket.emit(CONTROLLER_STATE_CHANGE, state);
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
                gameSocketItem.controllers = new Array(gameSocketItem.numOfPlayers);
                gameSocketItem.push(socket.id);
                handleSuccess();
            }
        } else {
            console.log('Controller tries to connect but failed');
            socket.emit('controller_connected', false);
        }
    });
    socket.on('disconnect', () => {
        if (gameSockets[socket.id]) {
            console.log('Game disconnected');
            const disconnectedGame = gameSockets[socket.id];
            if (controllerSockets[disconnectedGame.controllerId]) {
                const disconnectedController = controllerSockets[disconnectedGame.controllerId];
                disconnectedController.socket.emit('controller_connected', false);
                disconnectedController.gameId = '';
            }
            delete gameSockets[socket.id];
        }
        else if (controllerSockets[socket.id]) {
            console.log('Controller disconnected');
            const disconnectedController = controllerSockets[socket.id];
            if (gameSockets[disconnectedController.gameId]) {
                const disconnectedGame = gameSockets[disconnectedController.gameId];
                disconnectedGame.socket.emit('controller_connected', false);
                disconnectedGame.socket.emit('controller_disconnected');
                disconnectedGame.controllerId = '';
            }
            delete controllerSockets[socket.id];
        }
    });
});
