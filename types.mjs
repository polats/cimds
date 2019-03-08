export default /* GraphQL */ `
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
  }

  type ItemDefinition {
    id: ID!
    name: String!
    description: String!
    image: String!
  }

  type ItemInstance {
    id: ID!
    itemdef: ItemDefinition
  }

  input CreateGadgetInput {
    name: String!
    release_date: String!
  }

  type Query {
    uploads: [File]
    itemDefinitions: [ItemDefinition]
    getItemInstance(id: String!): ItemInstance
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
    addItemDefinition(name: String!): ItemDefinition
  }


`
