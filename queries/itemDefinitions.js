import gql from 'graphql-tag'

export default gql`
  query itemDefinitions {
    itemDefinitions {
      id
      name
      description
    }
  }`
