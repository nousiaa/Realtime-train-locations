/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './menu.css';

// Component for our top bar
const Menu = (props) => {
  const { cookies, signOut } = props;
  // is user logged in?
  if (cookies.get('user') && cookies.get('key')) {
    // user is logged in, show buttons that require user access
    return (
      <ul className="li2">
        <li>
          <Link to="/" className="link-button">
            Display Map
          </Link>
        </li>
        <li>
          <Link to="/about" className="link-button">
            My Profile
          </Link>
        </li>
        <li>
          <a href="#a" className="link-button" onClick={signOut}>
            Logout
          </a>
        </li>
      </ul>
    );
  }
  // user is not logged in, show only login and register buttons
  return (
    <ul className="li2">
      <li>
        <Link to="/login" className="link-button">
          Login
        </Link>
      </li>
      <li>
        <Link to="/register" className="link-button">
          Register
        </Link>
      </li>
    </ul>
  );
};
Menu.propTypes = {
  signOut: PropTypes.func,
  cookies: PropTypes.object,
};

Menu.defaultProps = {
  signOut: null,
  cookies: null,
};

export default Menu;
