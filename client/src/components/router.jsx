/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Login from './login';
import Register from './register';
import Map from './map';
import UserPage from './UserPage';

// Routes being used by the application, and the props that are passed through
//
// Route:        Component:
// "/"          Our map page
// "/about"     User profile page
// "/login"     Login page
// "/register"  Registration page
//
// all other routes point to our map component "/", but if user is not logged in,
// the map component redirects to "/login"
//
const Routes = (props) => {
  const {
    apiAddress,
    cookies,
    signIn,
    signOut,
    register,
  } = props;
  return (
    <div>
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => (
            <Map {...routeProps} apiAddress={apiAddress} cookies={cookies} signOut={signOut} />
          )}
        />
        <Route
          path="/about"
          render={routeProps => (
            <UserPage
              {...routeProps}
              signOut={signOut}
              apiAddress={apiAddress}
              cookies={cookies}
            />
          )}
        />
        <Route
          path="/login"
          render={routeProps => (
            <Login {...routeProps} signIn={signIn} cookies={cookies} />
          )}
        />
        <Route
          path="/register"
          render={routeProps => (
            <Register {...routeProps} register={register} cookies={cookies} />
          )}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
};
Routes.propTypes = {
  apiAddress: PropTypes.string,
  register: PropTypes.func,
  signIn: PropTypes.func,
  signOut: PropTypes.func,
  cookies: PropTypes.object,
};

Routes.defaultProps = {
  apiAddress: '',
  register: null,
  signIn: null,
  signOut: null,
  cookies: null,
};
export default Routes;
