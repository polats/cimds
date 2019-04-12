module.exports = `
  type User {
    _id: ID!
  }

  type Post {
    _id: ID!
    authorId: ID!
    title: String
    content: String

    author: User
    comments: [Comment]!
  }

  type Comment {
    _id: ID!
    postId: ID!
    authorId: ID
    content: String

    author: User
    post: Post
  }

  type File {
    _id: ID!
    filename: String!
    contentType: String!
  }

  type ItemDefinition {
    id: ID!
    name: String!
    description: String!
    external_url: String
    image: String
  }

  input ItemDefinitionInput {
    name: String!
    description: String!
    external_url: String
    image: String
  }

  type ItemInstance {
    id: ID!
    token_id: String!
    def_id: String!
  }

  input ItemInstanceInput {
    token_id: String!
    def_id: String!
  }

  type ItemLookup {
    instance_id: String!
    id: String!
    name: String!
    description: String!
    external_url: String
    image: String
  }

  type Query {
    me: User
    post(_id: ID!): Post
    posts: [Post]
    comment(_id: ID!): Comment
    uploads: [File]
    allItems: [ItemLookup]
    itemDefinitions: [ItemDefinition]
    itemInstances: [ItemInstance]
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
    addItemDefinition(input: ItemDefinitionInput!): ItemDefinition
    addItemInstance(input: ItemInstanceInput!): ItemInstance
    createPost(title: String, content: String): Post
    createComment(postId: ID!, content: String): Comment
  }
`
