import gql from 'graphql-tag'

export default gql`
  query allItems {
    allItems {
      instance_id
      id
      name
      description
      external_url
      image
    }
  }`
