import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'proptypes';
import _ from 'lodash';

import {gameList} from '../common/constants';

class GameChooser extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    setGame: PropTypes.func,
  }

  render() {
    const {setGame} = this.props;
    return (
      <div id="main">
        <section className="intro">
          <h1>WGC - Web Game Controller</h1>
          <p>
            WGC is a new way to play web-based games.
            By using socket,
            we are able to separate your game and your controller.
            Use your phone/pad as the controller to control,
            while watching on almost any device.
          </p>
          <p>
            You can also play multi-player games with your people,
            simply by scanning the QR code to join the game.
          </p>
        </section>
        <div className="game" id="GameBlock">
          <p>You can choose a game from below</p>
          <ul className="game-list">
            {
              _.map(gameList, (game) => (
                <li id={game.id} key={game.id}>
                  <Link to={game.link} onClick={() => setGame(gameList[game.id])}>
                    {game.name} -
                    {game.numOfPlayer === 1 ? 'Single player' : 'Multi player'}
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default GameChooser;
