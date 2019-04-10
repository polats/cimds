import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import itemDefinitionsQuery from '../queries/itemDefinitions'

import Field from './Field'
import UploadDropdown from './UploadDropdown'

const AddItemDefinitionQuery = gql`
  mutation($itemDefinition: ItemDefinitionInput!) {
    addItemDefinition(input: $itemDefinition) {
      id
      name
      description
      external_url
      image
    }
  }
`

class AddItemDefinition extends React.Component {

  state = {
    name: '',
    description: '',
    external_url: '',
    image: ''
    }

  handleChange = ({ target: { name, value } }) =>
      this.setState({ [name]: value })

  handleFileChange = (e) =>
      this.setState({ image: window.location.origin + "file/" + e.value})

  render() {

    const { user, mutate, onAdd } = this.props;

    return (
      <form onSubmit={ event => {
        event.preventDefault()

        const itemDefinition = this.state

        mutate({
          variables: { itemDefinition },
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
            name="name"
            placeholder="Name"
            required
            value={this.state.name}
            onChange={this.handleChange}
          />{' '}
        </Field>
        <Field>
          <textarea
            name="description"
            placeholder="description"
            required
            value={this.state.description}
            onChange={this.handleChange}
          />
        </Field>
        <Field>
          <input
            name="external_url"
            placeholder="external_url (https://game.site)"
            value={this.state.external_url}
            onChange={this.handleChange}
          />{' '}
        </Field>

        Image / 3D File
        <UploadDropdown
         onChange = {this.handleFileChange}
        />
        <button>Add Item Definition</button>
      </form>
    )
  }
}

export default graphql(AddItemDefinitionQuery)(AddItemDefinition)
