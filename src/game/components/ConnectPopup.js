import React from 'react';
import PropTypes from 'proptypes';

import events from '../../common/events';
import QrCode from '../../components/QrCode';

import {GameContext} from '../context/gameContext';

// const HOST = 'http://localhost:3000';
// const HOST = 'http://192.168.0.104:3000';
const HOST = 'http://192.168.1.7:3000';

export default class ConnectPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      numOfConnectedControllers: 0,
    };
  }

  static contextType = GameContext

  static propTypes = {
    collapsed: PropTypes.bool,
    gameInfo: PropTypes.shape({
      id: PropTypes.string,
      numOfPlayer: PropTypes.number,
    }),
  }

  componentDidUpdate(prevProps) {
    const gameId = this.props.gameInfo && this.props.gameInfo.id;
    if (gameId && prevProps.gameInfo && gameId !== prevProps.gameInfo.id) {
      this.initGameSocket();
    }
  }

  initGameSocket = () => {
    const socket = this.context.socket;

    socket.emit(events.GAME_CONNECT, this.props.gameInfo);

    socket.on(events.GAME_CONNECTED, this.onGameConnected);
    socket.on(events.CONTROLLER_CONNECTED, this.onControllerConnected);
    socket.on(events.CONTROLLER_ALL_CONNECTED, this.onAllControllersConnected);
  }

  onGameConnected = () => {
    const socket = this.context.socket;
    this.setState({
      url: `${HOST}/controller/${socket.id}`,
    });
    socket.off(events.GAME_CONNECTED);
  }

  onControllerConnected = (isConnected) => {
    if (!isConnected) {
      console.log('Controller failed to connect');
      return;
    }

    this.setState((prevState) => ({
      numOfConnectedControllers: prevState.numOfConnectedControllers + 1,
    }));
  }

  onAllControllersConnected = () => {
    const socket = this.context.socket;
    socket.off(events.CONTROLLER_CONNECTED);
    socket.on(events.CONTROLLER_STATE_CHANGE, this.onControllerStateChange);
  }

  onControllerStateChange = (state) => {

  }

  render() {
    const {url, numOfConnectedControllers} = this.state;
    const {collapsed, gameInfo} = this.props;
    const numOfPlayer = gameInfo ? gameInfo.numOfPlayer : 0;
    const isAllConnected = (numOfPlayer > 0) && (numOfConnectedControllers === numOfPlayer);
    const outStyle = {
      // margin: collapsed ? '10px' : '20px',
      margin: '10px',
    };
    const innerStyle = {
      display: (collapsed || isAllConnected) ? 'none' : 'block',
    };
    return (
      <div style={outStyle}>
        {
          numOfPlayer === 0
            ? 'Connection Status'
            : (
              numOfConnectedControllers === numOfPlayer
                ? 'Ready to Start!'
                : `Connected Controllers: ${numOfConnectedControllers}`
            )
        }
        <div style={innerStyle}>
          <QrCode url={url} width={128} height={128}/>
          {
            url && <a href={url}>Click to open the controller</a>
          }
        </div>
      </div>
    );
  }
}
