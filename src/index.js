/**
 * @file: index.js
 * @author: EvsChen
 **/

const socket = io();
const GAME_CONNECT = 'game_connect';
const GAME_CONNECTED = 'game_connected';
const CONTROLLER_STATE_CHANGE = 'controller_state_change';
const qr = document.createElement('div');
qr.id = 'qr';
document.body.appendChild(qr);
if (window.location.href.indexOf('?id=') > 0) {
    console.log(`Hey, you're a controller trying to connect to: ${window.location.href.split('?id=')[1]}`);
    socket.emit('controller_connect', window.location.href.split('?id=')[1]);
    const controllerState = {
        accelerate: false,
        steer: 0
    };
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
    document.body.addEventListener('touchstart', touchstart, false); // iOS & Android
    document.body.addEventListener('MSPointerDown', touchstart, false); // Windows Phone
    document.body.addEventListener('touchend', touchend, false); // iOS & Android
    document.body.addEventListener('MSPointerUp', touchend, false); // Windows Phone
    window.addEventListener('devicemotion', devicemotion, false);

    window.addEventListener('mousedown', touchstart, false);
    window.addEventListener('mouseup', touchend, false);
}
else {
    class Car {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.accelerate = false;
            this.speed = 0;
            this.steer = 0;
            const carDiv = document.createElement('div');
            carDiv.id = 'carId';
            carDiv.style.width = '100px';
            carDiv.style.height = '100px';
            carDiv.style.position = 'absolute';
            carDiv.style.left = `${x}px`;
            carDiv.style.top = `${y}px`;
            carDiv.style.backgroundColor = 'red';
            document.body.appendChild(carDiv);
            this.elem = document.getElementById('carId');
            // Key of the refresh
            this.refreshInterval = window.setInterval(this.refreshState.bind(this), 100);
        }

        setState(state) {
            this.accelerate = state.accelerate;
            this.steer = state.steer;
            this.refreshState();
        }

        refreshState() {
            if (this.accelerate) {
                if (this.speed < 20) {
                    this.speed += 3;
                }
            }
            else {
                if (this.speed > 0) {
                    this.speed -= 3;
                }
            }
            this.x += this.speed;
            this.setPositon();
        }

        setPositon() {
            this.elem.style.left = `${this.x}px`;
            this.elem.style.top = `${this.y}px`;
        }

        destroy() {
            document.body.removeChild(this.elem);
            window.clearInterval(this.refreshInterval);
        }
    }
    socket.emit('game_connect');
    const gameConnectedListener = () => {
        // const url = `http://172.20.10.10:3000?id=${socket.id}`;
        const url = `http://localhost:3000?id=${socket.id}`;
        document.body.innerHTML += url;
        const qrCode = new QRCode('qr');
        qrCode.makeCode(url);
        socket.removeListener('game_connected', gameConnectedListener);
    };
    const controllerConnectedListener = isConnected => {
        if (isConnected) {
            console.log('Controller connected successfully');
            document.getElementById('qr').style.display = 'none';
            let speed = 0;
            let controllerState = {};
            const car = new Car(100, 100);
            socket.on(CONTROLLER_STATE_CHANGE, state => {
                car.setState(state);
            });
            socket.on('controller_disconnected', () => {
                car.destroy();
            });
        }
        else {
            console.log('Controller failed to connect');
            document.getElementById('qr').style.display = 'block';
        }
    };
    socket.on('game_connected', gameConnectedListener);
    socket.on('controller_connected', controllerConnectedListener);
}
