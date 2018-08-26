import React from 'react';
import $ from 'jquery';
import PropTypes from 'proptypes';

import Game from '../components/Game';
import CubeGame from '../CubeGame';
import events from '../common/events';

const host = '192.168.199.199';

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


class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {}
    };
  }

  componentDidMount() {
    this.initGame(this.props.socket);
  }
  
  initGame = socket => {
    const gameList = document.getElementsByClassName('game-list')[0];
    gameList.addEventListener('click', e => {
        let target = e.target;
        let curTarget = e.currentTarget;
        while (target !== curTarget) {
            console.log(target);
            if (target.nodeName.toLowerCase() === 'li') {
                gameList.style.display = 'none';
                (socket, target.id);
                break;
            }
            target = target.parentNodinitGameSockete;
        }
    })
  }

  initGameSocket = (socket, gameId) => {
    const gameInfo = getGameInfo(gameId);
    socket.emit(events.GAME_CONNECT, gameInfo);
    socket.on(events.GAME_CONNECTED, onGameConnected);
    let numOfConnectedControllers = 0;
    socket.on(events.CONTROLLER_CONNECTED, controllerConnectedListener);
    function onGameConnected() {
        const url = `http://${host}:3000?id=${socket.id}`;
        const urlLink = $(`<a id="url" href="${url}" target="_blank">Click here to open the controller</a>`);
        const qr = $('<div id="qr"></div>');
        const connectedControllers = $(document.createElement('span')).attr('id', 'connectedControllers');
        const contDiv = $(document.createElement('div')).attr('id', 'gameSocket');
        contDiv.append(urlLink, qr, connectedControllers);
        $('body').append(contDiv);
        const qrCode = new QRCode('qr');
        qrCode.makeCode(url);
        socket.removeListener(events.GAME_CONNECTED, onGameConnected);
    };
    function controllerConnectedListener(isConnected) {
        if (isConnected) {
            console.log('Controller connected successfully');
            numOfConnectedControllers++;
            $('#connectedControllers').text(`${numOfConnectedControllers} controllers connected`);
            if (numOfConnectedControllers === gameInfo.numOfPlayers) {
                $('#gameSocket').remove();
                const game = showGame(gameId);
                socket.removeListener(events.CONTROLLER_CONNECTED, controllerConnectedListener);
                socket.on(events.CONTROLLER_STATE_CHANGE, state => {
                    game.setCube(state);
                });
                socket.on(events.CONTROLLER_DISCONNECTED, () => {
                });
            }
        }
        else {
            console.log('Controller failed to connect');
        }
    };
  }

  showGame = gameId => {
    const cubeGame = new CubeGame('GameBlock');
    return cubeGame;
  }

  render() {
    return (<Game />);
  }
}

GameContainer.propTypes = {
  socket: PropTypes.object
};

export default GameContainer;