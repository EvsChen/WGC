import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import GameChooser from './GameChooser';
import ConnectPopup from './components/ConnectPopup';
import PingpongContainer from './pingpong';
import Trex from './trex';

import {GameContext} from './context/gameContext';

import {connect} from './index.css';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      gameInfo: {},
      socket: window.io(),
    };
  }

  setGame = (gameInfo) => {
    this.setState({
      gameInfo: gameInfo,
      collapsed: false,
    });
  };

  toggleCollapse = () => {
    this.setState((prevState) => {
      return {
        collapsed: !prevState.collapsed,
      };
    });
  }

  render() {
    const {collapsed} = this.state;
    const context = {
      gameInfo: this.state.gameInfo,
      socket: this.state.socket,
    };
    return (
      <React.Fragment>
        <GameContext.Provider value={context}>
          <GameContext.Consumer>
            {
              (cxt) => (
                <React.Fragment>
                  <Router>
                    <div>
                      <Route exact path="/" render={(props) => {
                        return <GameChooser {...props} setGame={this.setGame} />;
                      }} />
                      <Route path="/pp" render={(props) => {
                        return <PingpongContainer {...props} {...cxt} />;
                      }}/>
                      <Route path="/dino" render={(props) => {
                        return <Trex {...props} {...cxt} />;
                      }}/>
                    </div>
                  </Router>
                  <div className={connect} onClick={this.toggleCollapse}>
                    <ConnectPopup {...cxt} collapsed={collapsed}/>   
                  </div>
                </React.Fragment>
              )
            }
          </GameContext.Consumer>
        </GameContext.Provider>
      </React.Fragment>
    );
  }  
}

