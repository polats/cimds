import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'
import itemDefinitionsQuery from '../queries/itemDefinitions'

import Field from './Field'

const AddItemDefinitionViaJsonQuery = gql`
  mutation($json: String!) {
    addItemDefinitionViaJson(json: $json) {
      id
      name
      description
      external_url
      image
      otherProps
    }
  }
`

class AddItemDefinitionViaJson extends React.Component {

  state = {
    json: ''
    }

  handleChange = ({ target: { name, value } }) =>
      this.setState({ [name]: value })

  render() {

    const { user, mutate, onAdd } = this.props;

    return (
      <form onSubmit={ event => {
        event.preventDefault()

        const json = this.state.json

        mutate({
          variables: { json: json },
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
          <textarea
            name="json"
            placeholder="JSON string"
            required
            value={this.state.json}
            onChange={this.handleChange}
          />
        </Field>

        <button>Process JSON</button>
      </form>
    )
  }
}

export default graphql(AddItemDefinitionViaJsonQuery)(AddItemDefinitionViaJson)
