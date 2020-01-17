import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <CookiesProvider>
      <Router>
        <App />
      </Router>
    </CookiesProvider>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
