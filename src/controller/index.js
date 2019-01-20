import React from 'react';

import events from '../common/events';
import ControllerState from './ControllerState';
import {button} from './index.css';

export default class Controller extends React.Component {
  constructor(props) {
    super(props);
    const io = window.io;
    this.state = {
      started: false,
      socket: io(),
    };
  }

  componentDidMount() {
    const {socketId} = this.props.match.params;
    this.state.socket.emit(events.CONTROLLER_CONNECT, socketId);
    this.registerSocketEvent();
    this.controllerState = new ControllerState({
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
    });
  }

  registerSocketEvent() {
    // window.addEventListener('devicemotion', this.onDeviceMotion, true);
    window.addEventListener('touchstart', this.onTouchStart);
  }

  onTouchStart = (e) => {
    if (!this.state.started) return;
    console.log(e);
    this.controllerState.setTouchStartPosition(
        e.touches[0].clientX,
        e.touches[0].clientY,
    );
    this.state.socket.emit(
        events.CONTROLLER_STATE_CHANGE,
        this.controllerState.getPercentageTouchOffset(),
    )
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchMove = (e) => {
    this.controllerState.setTouchPosition(
        e.touches[0].clientX,
        e.touches[0].clientY,
    );
    this.state.socket.emit(
        events.CONTROLLER_STATE_CHANGE,
        this.controllerState.getPercentageTouchOffset(),
    );
  }

  onTouchEnd = () => {
    this.controllerState.resetTouchPosition();
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }

  toggleStart = () => {
    this.setState((prevState) => ({
      started: !prevState.started,
    }));
    this.controllerState.reset();
  }

  render() {
    const {started} = this.state;
    return (
      <div>
        You have succesfully connected.
        <button className={button} onClick={this.toggleStart}>
          {started ? 'Stop' : 'Start'}
        </button>
        <div className="controller" id="controller">
          <button type="button" id="up">Up</button>
          <button type="button" id="left">Left</button>
          <button type="button" id="right">Right</button>
          <button type="button" id="down">Down</button>
        </div>
      </div>
    );
  }
}

