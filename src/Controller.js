import events from './common/events';

export {
  initController
};

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
      this.socket.emit(events.CONTROLLER_CONNECT, this.gameSocketId);
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
      this.socket.emit(events.CONTROLLER_STATE_CHANGE, this.controllerState);
  }

  disconnect() {
      this.socket.emit(events.CONTROLLER_DISCONNECTED, this.gameSocketId);
  }
}


function initController(socket) {
  document.getElementById('main').classList.add('hide');
  const socketId = window.location.href.split('?id=')[1];
  initControllerSocket(socket, socketId);
}

function initControllerSocket(socket, socketId) {
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

