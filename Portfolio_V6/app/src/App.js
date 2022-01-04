import React, { Fragment } from 'react';
// import { Helmet } from 'react-helmet';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import { HomePage } from './pages';

const App = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomePage} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
