const { parsed: localEnv } = require('dotenv').config();
const withCSS = require('@zeit/next-css');

const webpack = require('webpack');
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

const {
  AWS_APPSYNC_GRAPHQLENDPOINT,
  AWS_APPSYNC_REGION,
  AWS_APPSYNC_AUTHENTICATIONTYPE,
  AWS_APPSYNC_APIKEY
} = process.env;

const appSync = {
  AWS_APPSYNC_GRAPHQLENDPOINT: JSON.stringify(AWS_APPSYNC_GRAPHQLENDPOINT),
  AWS_APPSYNC_REGION: JSON.stringify(AWS_APPSYNC_REGION),
  AWS_APPSYNC_AUTHENTICATIONTYPE: JSON.stringify(AWS_APPSYNC_AUTHENTICATIONTYPE),
  AWS_APPSYNC_APIKEY: JSON.stringify(AWS_APPSYNC_APIKEY)
};

module.exports = withCSS({
  webpack: config => {
    const env = {
      API_KEY: apiKey,
      APP_SYNC: appSync
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
