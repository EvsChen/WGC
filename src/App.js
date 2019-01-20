import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Controller from './controller/index';
import ControllerList from './controller/List';
import Game from './game/index';

/* eslint-disable */
const App = () => {
  return (
    <React.Fragment>
      <Router>
        <div>
          <Route exact path="/controller" component={ControllerList} />
          <Route path="/controller/:socketId" component={Controller} />
          <Route exact path="/" component={Game} />
        </div>
      </Router>
    </React.Fragment>
  );
};

export default App;
