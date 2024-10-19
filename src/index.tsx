import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


// NOTE: using ! to assert this HTML element exists
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
    <App />
);
