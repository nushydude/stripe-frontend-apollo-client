import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import { App } from './components/App';
import * as serviceWorker from './serviceWorker';
import { getApolloClient } from './configs/apollo';

ReactDOM.render(
  <ApolloProvider client={getApolloClient('http://192.168.1.93:3001/graphql')}>
    <App />,
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
