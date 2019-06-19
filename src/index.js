import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

console.log('dupa')
import('./opening_times.json').then((openingTimesJson) => {
  ReactDOM.render(<App defaultOpeningTimes={openingTimesJson.default} />, document.getElementById('root'));
  serviceWorker.unregister();
})