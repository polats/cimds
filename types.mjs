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
  }

  input ItemDefinitionInput {
    name: String!
    description: String!
    image: String!
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

  input CreateGadgetInput {
    name: String!
    release_date: String!
  }

  type Query {
    uploads: [File]
    allItems: [ItemLookup]
    itemDefinitions: [ItemDefinition]
    itemInstances: [ItemInstance]
    lookUpItem(id: String!): ItemLookup
  }

  type Mutation {
    singleUpload(file: Upload!): File!
    multipleUpload(files: [Upload!]!): [File!]!
    addItemDefinition(input: ItemDefinitionInput!): ItemDefinition
    addItemInstance(def_id: String!): ItemInstance
  }


`
