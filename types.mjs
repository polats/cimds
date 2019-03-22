export default /* GraphQL */ `
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
    def_id: String!
  }

  type ItemLookup {
    id: String!
    name: String!
    description: String!
    image: String!
  }

  type Query {
    uploads: [File]
    allItems: [ItemLookup]
    itemDefinitions: [ItemDefinition]
    itemInstances: [ItemInstance]
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
    addItemDefinition(input: ItemDefinitionInput!): ItemDefinition
    addItemInstance(def_id: String!): ItemInstance
  }


`
