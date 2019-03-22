import gql from 'graphql-tag'

export default gql`
  query itemDefinitions {
    itemDefinitions {
      name
      description
      external_url
      image
    }
  }`
