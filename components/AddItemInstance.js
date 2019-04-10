import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'

import Field from './Field'
import ItemDefinitionDropdown from './ItemDefinitionDropdown'

const AddItemInstanceQuery = gql`
  mutation($itemInstance: ItemInstanceInput!) {
    addItemInstance(input: $itemInstance) {
      id
      token_id
      def_id
    }
  }
`

class AddItemInstance extends React.Component {

  state = {
    token_id: '',
    def_id: '',
    }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleDefinitionChange = (e) => {
    this.setState({ def_id: e.value})
  }

  render() {

    const { user, mutate, onAdd } = this.props;

    return (
      <form onSubmit={ event => {
        event.preventDefault()

        const itemInstance = this.state

        console.log(itemInstance)

        mutate({
          variables: { itemInstance },
        })
          .then(({ data }) => {
            if (onAdd) {
              onAdd();
            }
          })
          .catch((e) => {
            console.error(e);
          })
      }}
      >
        <Field>
          <input
            name="token_id"
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

export default graphql(AddItemInstanceQuery)(AddItemInstance)
