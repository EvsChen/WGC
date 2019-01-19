import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Controller from './controller';
import GameContainer from './GameContainer';

/* eslint-disable */
const App = () => {
  return (
    <React.Fragment>
      <Router>
        <div>
          <Route path="/controller/:socketId" component={Controller} />
          <Route exact path="/" component={GameContainer} />
        </div>
      </Router>
    </React.Fragment>
  );
};

export default App;
