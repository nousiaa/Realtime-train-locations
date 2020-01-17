/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './UserPage.css';

// Component for showing an user's profile page
export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}, // value for holding information about the user
    };
  }

  render() {
    const { user } = this.state;
    const { apiAddress, cookies, signOut } = this.props;
    // check that the user is logged in before allowing them to open the page
    if (!cookies.get('user') || !cookies.get('key')) {
      // not logged in, redirect to login
      return signOut();
    }
    // if user data is not already loaded, fetch it from the server api
    if (!user.user_name) {
      fetch(`${apiAddress}/api/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // authenticate using the key that the server sent to the user on logon
        body: JSON.stringify({
          key: cookies.get('key'),
        }),
      })
        .then(result => result.json())
        .then((res2) => {
          // fetch failed, user tampered with? -> remove user data and redirect to login
          if (!res2.success) {
            cookies.remove('user');
            cookies.remove('key');
            return <Redirect to="/login" />;
          }
          // api call successfull, set user state
          this.setState({
            user: res2,
          });
          return true;
        });
    }
    // user has been set, render the page (a table with user information)
    return (
      <div style={{ paddingLeft: '10px' }}>
        <h2>My Profile:</h2>
        My information:
        <br />
        <table className="user-table">
          <tbody>
            <tr>
              <td>
                <strong>Username:</strong>
              </td>
              <td>{user.user_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Email:</strong>
              </td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Full name:</strong>
              </td>
              <td>{user.full_name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

UserPage.propTypes = {
  signOut: PropTypes.func,
  apiAddress: PropTypes.string,
  cookies: PropTypes.object,
};

UserPage.defaultProps = {
  signOut: null,
  apiAddress: '',
  cookies: null,
};
