// default graphQL playground queries
export default {
  itemDefinitions :
  `query {
    itemDefinitions {
      id
      name
      description
      image
    }
  }`,

  getItemInstance :
  `query {
    getItemInstance(id:"2")
  	{
      id
      itemdef {
        id
        name
        description
        image
      }
    }
  }`
}
