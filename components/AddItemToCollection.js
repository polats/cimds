import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import itemInstancesQuery from '../queries/itemInstances'

import Field from './Field'
import ItemDefinitionDropdown from './ItemDefinitionDropdown'

class AddItemToCollection extends Component {

  state = {
    def_id: '',
    collection_id: ''
    }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleDefinitionChange = (e) => {
    this.setState({ def_id: e.value})
  }

  handleSubmit = event => {
    event.preventDefault()

    const itemInstance = this.state

    this.props.mutate({

      variables: { itemInstance },
      update(
        proxy,
        {
          data: { addItemInstance }
        }
      ) {
        const data = proxy.readQuery({ query: itemInstancesQuery })
        data.itemInstances.push(addItemInstance)
        proxy.writeQuery({ query: itemInstancesQuery, data })
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Field>
          <input
            name="collection_id"
            placeholder="ID"
            required
            value={this.state.name}
            onChange={this.handleChange}
          />{' '}
        </Field>

        <ItemDefinitionDropdown
         onChange = {this.handleDefinitionChange}
        />
        <button>Add Item To Collection</button>
      </form>
    )
  }
}

export default graphql(gql`
  mutation($itemInstance: ItemInstanceInput!) {
    addItemInstance(input: $itemInstance) {
      id
      collection_id
      def_id
    }
  }
`)(AddItemToCollection)
