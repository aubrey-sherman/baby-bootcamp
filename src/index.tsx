import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


// NOTE: using ! to assert this HTML element exists
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Auth0Provider
    domain="dev-5hwsazsqknzyyvmj.us.auth0.com"
    clientId="3kOP1dFNkT4PiD1AL8R82s6eQLTSmGT8"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);
