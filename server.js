/**
* @file: server.js
* @author: EvsChen
*/

const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';

const http = require('http');
const express = require('express');
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
    socket.on(GAME_CONNECT, () => {
        console.log('Game connected');
        gameSockets[socket.id] = {
            socket
        };
        socket.emit(GAME_CONNECTED);
    });
    socket.on('controller_connect', SocketId => {
        if (gameSockets[SocketId] && !gameSockets[SocketId].controllerId) {
            controllerSockets[socket.id] = {
                socket,
                gameId: SocketId
            };
            gameSockets[SocketId].controllerId = socket.id;
            gameSockets[SocketId].socket.emit('controller_connected', true);
            // Forward the changes in states onto the relative game socket
            socket.on(CONTROLLER_STATE_CHANGE, state => {
                console.log(state);
                if (gameSockets[SocketId]) {
                    gameSockets[SocketId].socket.emit(CONTROLLER_STATE_CHANGE, state);
                }
            });
            console.log('Controller connected successfully');
        }
        else {
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
