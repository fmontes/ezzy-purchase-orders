import { Rehydrated } from 'aws-appsync-react';
import { createHttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import App, { Container } from 'next/app';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import Cookies from 'js-cookie';
import '@shopify/polaris/styles.css';

const appSyncLink = createAppSyncLink({
  url: APP_SYNC.AWS_APPSYNC_GRAPHQLENDPOINT,
  region: APP_SYNC.AWS_APPSYNC_REGION,
  auth: {
    type: APP_SYNC.AWS_APPSYNC_AUTHENTICATIONTYPE,
    apiKey: APP_SYNC.AWS_APPSYNC_APIKEY
  }
});

const shopifyLink = createHttpLink({
  fetchOptions: {
    credentials: 'include'
  }
});

const link = ApolloLink.split(operation => operation.getContext().name === 'aws', appSyncLink, shopifyLink);

export const client = new AWSAppSyncClient({ disableOffline: true }, { link });

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get('shopOrigin');
    return (
      <Container>
        <AppProvider>
          <Provider
            config={{
              apiKey: API_KEY,
              shopOrigin: shopOrigin,
              forceRedirect: true
            }}
          >
            <ApolloProvider client={client}>
              <Rehydrated>
                <Component {...pageProps} />
              </Rehydrated>
            </ApolloProvider>
          </Provider>
        </AppProvider>
      </Container>
    );
  }
}

export default MyApp;
