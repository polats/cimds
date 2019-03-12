// default graphQL playground queries
export default {
  allItems:
  `
  query {
    allItems {
      id
      name
      description
    }
  }
  `,
  itemDefinitions :
  `query {
    itemDefinitions {
      id
      name
      description
    }
  }`,

  itemInstances :
  `query {
    itemInstances {
      id
      def_id
    }
  }`,

  lookUpItem :
  `query {
    lookUpItem(id:"2")
  	{
      id
      name
      description
      image
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
  addItemInstance(
    def_id: "5c86887825a663510c7a37a2",
  )
  {
    id
    def_id
  }
}`
}
