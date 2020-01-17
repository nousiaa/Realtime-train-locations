/* eslint-disable react/no-string-refs */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component for our login form
export default class Login extends Component {
  // handle login form submit
  hSignIn(e) {
    const { signIn } = this.props;
    e.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    signIn(username, password, this.props);
  }


  // render our login form
  render() {
    const { cookies } = this.props;
    // if user is already logged in, disable access to login page
    if (cookies.get('user') && cookies.get('key')) {
      return <Redirect to="/" />;
    }
    // our form
    return (
      <div style={{ paddingLeft: '5px' }}>
        <form onSubmit={this.hSignIn.bind(this)}>
          <h3>Sign in</h3>
          <input type="text" ref="username" placeholder="Username" />
          <br />
          <input type="password" ref="password" placeholder="Password" />
          <br />
          <input type="submit" value="Login" className="link-button" />
        </form>
      </div>
    );
  }
}
Login.propTypes = {
  signIn: PropTypes.func,
  cookies: PropTypes.object,
};

Login.defaultProps = {
  signIn: null,
  cookies: null,
};
