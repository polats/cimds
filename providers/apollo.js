import withApollo from 'ooth-client-react-next-apollo';
import getConfig from 'next/config';
import { createUploadLink } from 'apollo-upload-client'

const {
  publicRuntimeConfig: { url },
  serverRuntimeConfig,
} = getConfig();

export default withApollo({
  url: `${(serverRuntimeConfig && serverRuntimeConfig.url) || url}/graphql`,
  apolloOpts: {
    link: createUploadLink({ uri: process.env.GRAPHQL_URI })
  }
});
