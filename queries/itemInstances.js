import gql from 'graphql-tag'

export default gql`
  query itemInstances {
    itemInstances {
      id
      collection_id
      def_id
    }
  }`
