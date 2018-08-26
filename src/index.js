/**
 * @file: index.js
 * @author: EvsChen
 **/
import './style.less';
import anime from 'animejs';
import CubeGame from './CubeGame';
import Car from './Car';
import $ from 'jquery';
import _ from 'lodash';

const socket = io();
const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_CONNECT = 'controller_connect';
const CONTROLLER_CONNECTED = 'controller_connected';
const CONTROLLER_DISCONNECTED = 'controller_disconnected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';

class Controller {
    /**
     * @param {Object} socketConfig 
     * @param {Object} socketConfig.socket - socket for the controller
     * @param {string} socketConfig.gameSocketId - the id for the game socket
     * @param {Object} state - the initial state of the controller
     */
    constructor(socketConfig, state) {
        this.socket = socketConfig.socket;
        this.gameSocketId = socketConfig.gameSocketId;
        this.socket.emit(CONTROLLER_CONNECT, this.gameSocketId);
        this.controllerState = state;
    }
    /**
     * @param {Object} newState 
     */
    setState(newState) {
        Object.assign(this.controllerState, newState);
        this.emitUpdates();
    }

    emitUpdates() {
        this.socket.emit(CONTROLLER_STATE_CHANGE, this.controllerState);
    }

    disconnect() {
        this.socket.emit(CONTROLLER_DISCONNECTED, this.gameSocketId);
    }
}

// Determine whether the connected client is a controller or a game
if (window.location.href.indexOf('?id=') > 0) {
    initController();
} else {
    initGame();
}

function initGame() {
    const gameList = document.getElementsByClassName('game-list')[0];
    const gameBlock = document.getElementById('GameBlock');
    gameList.addEventListener('click', e => {
        let target = e.target;
        let curTarget = e.currentTarget;
        while (target !== curTarget) {
            console.log(target);
            if (target.nodeName.toLowerCase() === 'li') {
                gameList.style.display = 'none';
                initGameSocket(target.id);
                break;
            }
            target = target.parentNode;
        }
    });
}

/**
 * @function getGameInfo - get full info of the game
 * @param {string} id 
 * @returns {Object} gameInfo - gameInfo
 * @returns {boolean} gameInfo.multi - whether the game is a multiplayer game
 * @returns {number} gameInfo.numOfPlayer
 */
function getGameInfo(id) {
    const resObj = {
        id
    };
    switch (id) {
        case 'TestMulti':
            resObj.multi = true;
            resObj.numOfPlayers = 2;
            break;
        default:
            resObj.multi = false;
    }
    return resObj;
}

function initGameSocket(gameId) {
    const gameInfo = getGameInfo(gameId);
    socket.emit(GAME_CONNECT, gameInfo);
    socket.on(GAME_CONNECTED, gameConnectedListener);
    let numOfConnectedControllers = 0;
    socket.on(CONTROLLER_CONNECTED, controllerConnectedListener);
    function gameConnectedListener() {
        const url = `http://172.18.27.18:3000?id=${socket.id}`;
        // const url = `http://localhost:3000?id=${socket.id}`;
        // const url = `http://192.168.31.22:3000?id=${socket.id}`;
        const urlLink = $(`<a id="url" href="${url}" target="_blank">Click here to open the controller</a>`);
        const qr = $('<div id="qr"></div>');
        const connectedControllers = $(document.createElement('span')).id('connectedControllers');
        const contDiv = $(document.createElement('div')).id('gameSocket');
        contDiv.append(urlLink, qr, connectedControllers);
        $('body').append(contDiv);
        const qrCode = new QRCode('qr');
        qrCode.makeCode(url);
        socket.removeListener(GAME_CONNECTED, gameConnectedListener);
    };
    function controllerConnectedListener(isConnected) {
        if (isConnected) {
            console.log('Controller connected successfully');
            numOfConnectedControllers++;
            $('#connectedControllers').text(`${numOfConnectedControllers} controllers connected`);
            if (numOfConnectedControllers === gameInfo.numOfPlayers) {
                $('#gameSocket').remove();
                const game = showGame(gameId);
                socket.removeListener(CONTROLLER_CONNECTED, controllerConnectedListener);
                socket.on(CONTROLLER_STATE_CHANGE, state => {
                    game.setCube(state);
                });
                socket.on(CONTROLLER_DISCONNECTED, () => {
                });
            }
        }
        else {
            console.log('Controller failed to connect');
        }
    };
}

function showGame(gameId) {
    const cubeGame = new CubeGame('GameBlock');
    return cubeGame;
}

function initController() {
    document.getElementById('main').classList.add('hide');
    initControllerSocket(window.location.href.split('?id=')[1]);
}

function initControllerSocket(socketId) {
    console.log(`Hey, you're a controller trying to connect to: ${socketId}`);
    document.getElementById('controller').classList.add('show');
    const MODE = 'touch';
    if (MODE === 'touch') {
        const initState = {
            plusX: 0,
            plusY: 0
        };
        const touchController = new Controller({
            socket,
            gameSocketId: socketId
        }, initState);
        const recordPosition = {
            x: 0,
            y: 0
        };
        function mousedownListener(e) {
            recordPosition.x = e.clientX;
            recordPosition.y = e.clientY;
            window.addEventListener('mousemove', mousemoveListener)
        }
        function mouseupListener(e) {
            recordPosition.x = 0;
            recordPosition.y = 0;
            window.removeEventListener('mousemove', mousemoveListener);
        }
        function mousemoveListener(e) {
            const plusX = e.clientX - recordPosition.x;
            const plusY = e.clientY - recordPosition.y;
            touchController.setState({
                plusX: plusX / 100,
                plusY: - plusY / 100
            });
        }
        window.addEventListener('mousedown', mousedownListener);
        window.addEventListener('mouseup', mouseupListener);
        function touchstartListener(e) {
            recordPosition.x = e.touches[0].clientX;
            recordPosition.y = e.touches[0].clientY;
            window.addEventListener('touchmove', touchmoveListener);
        };
        function touchmoveListener(e) {
            touchController.setState({
                plusX: (e.touches[0].clientX - recordPosition.x) / 100,
                plusY: - (e.touches[0].clientY - recordPosition.y) / 100
            })
        }
        function touchendListener(e) {
            recordPosition.x = 0;
            recordPosition.y = 0;
            window.removeEventListener('touchmove', touchmoveListener);
        }
        window.addEventListener('touchstart', touchstartListener);
        window.addEventListener('touchend', touchendListener); // iOS & Android
        // window.addEventListener('devicemotion', devicemotion, false);
    } else if (MODE === 'direction') {
    }
}

