import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'proptypes';
import _ from 'lodash';

const gameList = [
  {
    name: 'Asteroids',
    id: 'Asteroids',
    numOfPlayer: 1,
    link: '',
  },
  {
    name: 'Chrome dinosaur',
    id: 'Chrome dinosaur',
    numOfPlayer: 1,
    link: '/dino',
  },
  {
    name: 'Test',
    id: 'TestSingle',
    numOfPlayer: 1,
    link: '',
  },
  {
    name: 'Test',
    id: 'TestMulti',
    numOfPlayer: 2,
    link: '',
  },
  {
    name: 'Ping pong',
    id: 'pingpong',
    numOfPlayer: 1,
    link: '/pp',
  },
];

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
        <div className="game nes-container with-title" id="GameBlock">
          <p className="title">Choose a game from below</p>
          <ul className="game-list">
            {
              _.map(gameList, (game, index) => (
                <li id={game.id} key={game.id}>
                  <Link to={game.link} onClick={() => setGame(gameList[index])}>
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
