import gql from 'graphql-tag'

export default gql`
  query itemInstances {
    itemInstances {
      id
      token_id
      def_id
    }
  }`
