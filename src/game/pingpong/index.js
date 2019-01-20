import React from 'react';

import {GameContext} from '../context/gameContext';
import events from '../../common/events';

class PingpongContainer extends React.Component {
  static contextType = GameContext;

  componentDidMount() {
    this.iframe.contentWindow.onload = () => {
      this.PingPong = this.iframe.contentWindow.PingPong;
      this.context.socket.on(
          events.CONTROLLER_STATE_CHANGE,
          this.onControllerStateChange
      );
    };
  }

  onControllerStateChange = ({offsetX, offsetY}) => {
    this.PingPong.scene.mousePosition = {
      x: offsetX,
      y: -offsetY,
    };
  }

  render() {
    return (
      <iframe src="http://localhost:3000/pingpong" ref={(ifr) => this.iframe = ifr}/>
    );
  }
}

export default PingpongContainer;
