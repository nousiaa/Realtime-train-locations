/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

// Component for our register page
export default class Register extends Component {
  // handle registration form submission
  hRegister(e) {
    const { register } = this.props;
    e.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const email = this.refs.email.value;
    const fullname = this.refs.fullname.value;
    register(username, password, email, fullname);
  }

  render() {
    const { cookies } = this.props;
    // if user is already logged in, disable access to registration page
    if (cookies.get('user') && cookies.get('key')) {
      return <Redirect to="/" />;
    }
    // our form
    return (
      <div style={{ paddingLeft: '5px' }}>
        <form onSubmit={this.hRegister.bind(this)}>
          <h3>Create account</h3>
          <input type="text" ref="username" placeholder="Username" />
          <br />
          <input type="text" ref="fullname" placeholder="Full name" />
          <br />
          <input type="text" ref="email" placeholder="Email" />
          <br />
          <input type="password" ref="password" placeholder="Password" />
          <br />
          <input type="submit" value="Register" className="link-button" />
        </form>
      </div>
    );
  }
}
Register.propTypes = {
  register: PropTypes.func,
  cookies: PropTypes.object,
};

Register.defaultProps = {
  register: null,
  cookies: null,
};
