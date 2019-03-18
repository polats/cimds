import gql from 'graphql-tag'

export default gql`
  query uploads {
    uploads {
      _id
      filename
      contentType
    }
  }
`
