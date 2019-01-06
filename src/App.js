import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import ControllerContainer from './container/ControllerContainer';
import GameContainer from './container/GameContainer';

/* eslint-disable */
const App = () => {
  return (
    <React.Fragment>
      <Router>
        <div>
          <Route path="/controller/:socketId" component={ControllerContainer} />
          <Route exact path="/" component={GameContainer} />
        </div>
      </Router>
    </React.Fragment>
  );
};

export default App;
