import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import itemDefinitionsQuery from '../queries/itemDefinitions'

import Field from './Field'
import UploadDropdown from './UploadDropdown'

class AddItemDefinition extends Component {
  state = {
    name: '',
    description: '',
    external_url: '',
    image: ''
    }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleFileChange = (e) =>
    this.setState({ image: e.value})


  handleSubmit = event => {
    event.preventDefault()

    const itemDefinition = this.state

    console.log(itemDefinition)

    this.props.mutate({

      variables: { itemDefinition },
      update(
        proxy,
        {
          data: { addItemDefinition }
        }
      ) {
        const data = proxy.readQuery({ query: itemDefinitionsQuery })
        data.itemDefinitions.push(addItemDefinition)
        proxy.writeQuery({ query: itemDefinitionsQuery, data })
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
        <UploadDropdown name="image"
         onChange = {this.handleFileChange}
        />
        <button>Add Item Definition</button>
      </form>
    )
  }
}

export default graphql(gql`
  mutation($itemDefinition: ItemDefinitionInput!) {
    addItemDefinition(input: $itemDefinition) {
      name
      description
      external_url
      image
    }
  }
`)(AddItemDefinition)
