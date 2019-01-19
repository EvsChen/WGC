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

import {connect} from './styles/connect.css';

class GameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      gameInfo: {},
      socket: window.io(),
    };
  }

  setGame = (gameInfo) => {
    this.setState({gameInfo});
    this.setState({
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
          <Router>
            <div>
              <Route exact path="/" render={(props) => {
                return <GameChooser {...props} setGame={this.setGame} />;
              }} />
              <Route path="/pp" component={PingpongContainer} />
              <Route path="/dino" component={Trex} />
            </div>
          </Router>
          <div className={connect} onClick={this.toggleCollapse}>
            <GameContext.Consumer>
              {
                (cxt) => (
                  <ConnectPopup {...cxt} collapsed={collapsed}/>
                )
              }
            </GameContext.Consumer>
          </div>
        </GameContext.Provider>
      </React.Fragment>
    );
  }  
}

export default GameContainer;
