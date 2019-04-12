// default graphQL playground queries
module.exports = {
  itemCollection:
  `
  query {
    allItems {
      instance_id
      id
      name
      description
      external_url
      image
    }
  }
  `,
  itemDefinitions :
  `query {
    itemDefinitions {
      id
      name
      description
      external_url
      image
    }
  }`,

  itemInstances :
  `query {
    itemInstances {
      id
      collection_id
      def_id
    }
  }`,

  addItemDefinition :
  `mutation {
  addItemDefinition(input: {
    name: "Weapon",
    description:"Weapon Desc",
    image: "Test"
  })
  {
    id
    name
  }
}`,
  addItemInstance :
  `mutation {
  addItemInstance(input: {
    collection_id: "1",
    def_id: "5c9481d67f270061f48fdea3",
  })
  {
    id
    collection_id
    def_id
  }
}`
}
