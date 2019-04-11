// const withCSS = require('@zeit/next-css')
// module.exports = withCSS()

//  const BabiliPlugin = require('babili-webpack-plugin');
require('dotenv').config()

module.exports = {
  publicRuntimeConfig: {
    url: process.env.URL,
    facebookClientId: process.env.FACEBOOK_CLIENT_ID,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    twitterClientId: process.env.TWITTER_CLIENT_ID,
  },
  // serverRuntimeConfig: {
  //   url: process.env.SERVER_SIDE_URL || process.env.URL,
  // },
  // webpack(config, { dev }) {
  //   // remove Uglify plugin
  //   config.plugins = config.plugins.filter((plugin) => {
  //     return plugin.constructor.name !== 'UglifyJsPlugin';
  //   });
  //
  //   if (!dev) {
  //     // add Babili plugin
  //     config.plugins.push(new BabiliPlugin());
  //   }
  //
  //   return config;
  // },
};
