import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import events from './common/events'
import {initController} from './Controller';
import GameContainer from './container/GameContainer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: {}
    };
  }

  componentDidMount() {
    const io = window.io;
    this.state.socket = io();
    // Determine whether the connected client is a controller or a game
    // if (window.location.href.indexOf('?id=') > 0) {
    //   initController(socket);
    // } else {
    //   initGame(socket);
    // }
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={props => {
            return <GameContainer {...props} socket={this.state.socket}/>;
          }}/>
          <div class="controller" id="controller">
              <button type="button" id="up">Up</button>
              <button type="button" id="left">Left</button>
              <button type="button" id="right">Right</button>
              <button type="button" id="down">Down</button>
          </div>
        </div>
      </Router>      
    )
  }
}