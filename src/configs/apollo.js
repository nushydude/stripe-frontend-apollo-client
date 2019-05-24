import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

let apolloClient;

export function initApolloClient(uri) {
  apolloClient = new ApolloClient({
    link: new HttpLink({ uri }),
    cache: new InMemoryCache(),
  });

  return apolloClient;
}

export function getApolloClient(uri) {
  if (!apolloClient) {
    return initApolloClient(uri);
  }

  return apolloClient;
}
