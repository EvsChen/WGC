/**
 * @file: index.js
 * @author: EvsChen
 **/
import './style.less';
import anime from 'animejs';
import * as sketch from './sketch';
import Car from './Car';
import $ from 'jquery';

const socket = io();
const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_CONNECT = 'controller_connect';
const CONTROLLER_CONNECTED = 'controller_connected';
const CONTROLLER_DISCONNECTED = 'controller_disconnected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';

if (window.location.href.indexOf('?id=') > 0) {
    initController();
} else {
    initGame();
}

function initController() {
    document.getElementById('main').classList.add('hide');
    initControllerSocket(window.location.href.split('?id=')[1]);
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

function initGameSocket(gameId) {
    socket.emit(GAME_CONNECT);
    socket.on(GAME_CONNECTED, gameConnectedListener);
    socket.on(CONTROLLER_CONNECTED, controllerConnectedListener);
    function gameConnectedListener() {
        // const url = `http://172.20.10.10:3000?id=${socket.id}`;
        // const url = `http://localhost:3000?id=${socket.id}`;
        const url = `http://192.168.31.22:3000?id=${socket.id}`;
        const urlLink = document.createElement('a');
        urlLink.id = 'url';
        urlLink.href = url;
        urlLink.text = 'Click here to open the controller';
        urlLink.target = '_blank';
        document.body.appendChild(urlLink);
        const qr = document.createElement('div');
        qr.id = 'qr';
        document.body.appendChild(qr);
        const qrCode = new QRCode('qr');
        qrCode.makeCode(url);
        socket.removeListener(GAME_CONNECTED, gameConnectedListener);
    };
    function controllerConnectedListener(isConnected) {
        if (isConnected) {
            console.log('Controller connected successfully');
            $('#qr').remove();
            $('#url').remove();
            showGame(gameId);
            socket.on(CONTROLLER_STATE_CHANGE, state => {
            });
            socket.on(CONTROLLER_DISCONNECTED, () => {
            });
        }
        else {
            console.log('Controller failed to connect');
            document.getElementById('qr').style.display = 'block';
        }
    };
}

function showGame(gameId) {
    sketch.init('GameBlock');
}

function initControllerSocket(socketId) {
    console.log(`Hey, you're a controller trying to connect to: ${socketId}`);
    document.getElementById('controller').classList.add('show');
    socket.emit(CONTROLLER_CONNECT, socketId);
    const controllerState = {
        accelerate: false,
        steer: 0,
        direction: 0
    };
    const MODE = 'direction';
    const emitUpdates = () => {
        socket.emit(CONTROLLER_STATE_CHANGE, controllerState);
    };
    const touchstart = e => {
        e.preventDefault();
        console.log('mouse down');
        controllerState.accelerate = true;
        emitUpdates();
    };
    const touchend = e => {
        e.preventDefault();
        controllerState.accelerate = false;
        emitUpdates();
    };
    const devicemotion = e => {
        controllerState.steer = e.accelerationIncludingGravity.y / 100;
        emitUpdates();
    };
    if (MODE === 'touch') {
        window.addEventListener('touchstart', touchstart, false); // iOS & Android
        window.addEventListener('MSPointerDown', touchstart, false); // Windows Phone
        window.addEventListener('touchend', touchend, false); // iOS & Android
        window.addEventListener('MSPointerUp', touchend, false); // Windows Phone
        window.addEventListener('devicemotion', devicemotion, false);
        window.addEventListener('mousedown', touchstart, false);
        window.addEventListener('mouseup', touchend, false);
    } else if (MODE === 'direction') {
        const leftAction = () => {
            console.log('Left button clicked');
            controllerState.direction -= 5;
            emitUpdates();
        };
        const rightAction = () => {
            console.log('Right button clicked');
            controllerState.direction += 5;
            emitUpdates();
        };
        document.getElementById('left').onclick = leftAction;
        document.getElementById('right').onclick = rightAction;
    }
}
