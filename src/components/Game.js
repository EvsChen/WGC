import React from 'react';

const Game = props => {
  return (
    <div id="main">
        <section className="intro">
            <h1>WGC - Web Game Controller</h1>
            <p>WGC is a new way to play web-based games. By using socket, we are able to separate your game and your controller.
                Use your phone/pad as the controller to control, while watching on almost any device.
            </p>
            <p>
                You can also play multi-player games with your people, simply by scanning the QR code to join the game.
            </p>
        </section>
        <div className="game" id="GameBlock">
            <p>
                You can choose a game from below
            </p>
            <ul className="game-list">
                <li id="Asteroids">
                    <div>
                        <span>Asteroids</span>
                        <em>Single-player</em>
                    </div>
                </li>
                <li id="TestSingle">
                    <div>
                        <span>Test</span>
                        <em>Single-player</em>
                    </div>
                </li>
                <li id="TestMulti">
                    <div>
                        <span>Test</span>
                        <em>Multi-player</em>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Game;