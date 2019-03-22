import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'

import Field from './Field'
import UploadDropdown from './UploadDropdown'

class AddItemDefinition extends Component {
  state = {
    name: '',
    description: '',
    external_url: '',
    image: ''
    }

  uploads = [
    {
      _id: 1,
      filename: "1.png"
    }]


  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleFileChange = (e) =>
    this.setState({ image: e.value})


  handleSubmit = event => {
    event.preventDefault()

    const file = new Blob([this.state.content], { type: 'text/plain' })
    file.name = `${this.state.name}.txt`

    this.props.mutate({
      variables: { file },
      update(
        proxy,
        {
          data: { singleUpload }
        }
      ) {
        const data = proxy.readQuery({ query: uploadsQuery })
        data.uploads.push(singleUpload)
        proxy.writeQuery({ query: uploadsQuery, data })
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
  mutation AddItemDefinition($itemdef: ItemDefinitionInput!) {
    addItemDefinition(itemdef: $itemdef) {
      name
      description
      external_url
      image
    }
  }
`)(AddItemDefinition)
