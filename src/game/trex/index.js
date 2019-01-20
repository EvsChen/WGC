import React from 'react';
import './trex';
import './style.css';
import events from '../../common/events';
import png1 from './assets/default_100_percent/100-offline-sprite.png';
import png2 from './assets/default_200_percent/200-offline-sprite.png';

export default class Dinosaur extends React.Component {
  componentDidMount() {
    new Runner('.interstitial-wrapper');
    document.addEventListener('keydown', this.onKeydown);
    this.props.socket.on(events.CONTROLLER_STATE_CHANGE, this.handleControllerState);
  }

  handleControllerState = (state) => {
    const {zAcce} = state;
    if (zAcce > 5) {
      console.log('jump! ' + zAcce);
    }
  }

  onKeydown(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 32) {
      const box = document.getElementById('messageBox');
      box.style.visibility = 'hidden';
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  render() {
    return (
      <div>
        <div id="messageBox" className="sendmessage">
          <h1 style={{
            textAlign: 'center',
            fontFamily: 'Open Sans, sans-serif',
          }}>
            Press Space to start
          </h1>
        </div>
        <div id="main-frame-error" className="interstitial-wrapper">
          <div id="main-content">
            <div className="icon icon-offline" alt=""></div>
          </div>
          <div id="offline-resources" style={{display: 'none'}}>
            <img id="offline-resources-1x" src={png1} />
            <img id="offline-resources-2x" src={png2} />
          </div>
        </div>
      </div>
    );
  }
};
