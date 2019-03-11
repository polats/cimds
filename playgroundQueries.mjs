// default graphQL playground queries
export default {
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
}`
}
