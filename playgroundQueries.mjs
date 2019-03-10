// default graphQL playground queries
export default {
  itemDefinitions :
  `query {
    itemDefinitions {
      def_id
      name
      description
      image
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
  }`
}
