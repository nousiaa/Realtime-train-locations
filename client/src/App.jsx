/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import 'whatwg-fetch';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';
import './App.css';
import Menu from './components/menu';
import Routes from './components/router';

// base address for our server
const apiAddress = 'http://localhost:3100';

class App extends Component {
  // handle user account reqistration
  static register(username, password, email, fullname) {
    // send wanted account details to server
    fetch(`${apiAddress}/api/addUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
        fullname,
      }),
    })
      .then(result => result.json())
      .then((res2) => {
        // did the account get created?
        if (res2) {
          // account created, redirect to login page
          window.location.href = '/login';
        } else {
          // account could not be created, give the user a popup
          // eslint-disable-next-line no-alert
          alert('Could not create user account, please try to use a different username');
        }
      });
  }

  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.state = {};
  }

  // handle login
  signIn(username, password) {
    const { cookies } = this.props;
    // authenticate user through login api
    fetch(`${apiAddress}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // send username and password
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(result => result.json())
      .then((res2) => {
        // did the login succeed?
        if (res2.success) {
          // login ok, set the user information to browser cookies
          cookies.set('user', username, { path: '/' });
          cookies.set('key', res2.key, { path: '/' });
          // direct user to their profile page
          window.location.href = '/about';
        } else {
          // login failed, give the user a failure popup
          // eslint-disable-next-line no-alert
          alert('Incorrect username/password');
        }
      });
  }

  // handle logging out
  signOut() {
    const { cookies } = this.props;
    // remove user cookies and redirect back to login page
    cookies.remove('user');
    cookies.remove('key');
    return <Redirect to="/login" />;
  }

  // render our app (set routes and the menu bar, which handles the rest of the application)
  render() {
    const { cookies } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <div className="d1">
            <Menu MOVE={this.MOVE} signOut={this.signOut} cookies={cookies} />
          </div>
          <div>
            <Routes
              apiAddress={apiAddress}
              state={this.state}
              signIn={this.signIn}
              signOut={this.signOut}
              register={App.register}
              cookies={cookies}
            />
          </div>
        </header>
      </div>
    );
  }
}

App.propTypes = {
  cookies: PropTypes.object,
};

App.defaultProps = {
  cookies: null,
};

export default withCookies(App);
