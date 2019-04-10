import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import { Table, Head, Cell } from './Table'
import AddItemDefinition from './AddItemDefinition'

const ItemDefinitionsQuery = gql`
  query itemDefinitions {
    itemDefinitions {
      id
      name
      description
      external_url
      image
    }
  }`

class ItemDefinitions extends React.Component {
  render() {
    const {
      data: { loading, itemDefinitions, refetch },
    } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <AddItemDefinition onAdd={refetch} />
        <Table
          thead={
            <tr>
              <Head>ID</Head>
              <Head>Name</Head>
              <Head>Description</Head>
              <Head>External_Url</Head>
              <Head>Image</Head>
            </tr>
          }
          tbody={itemDefinitions.map(({ id, name, description, external_url, image }) => (
            <tr key={id}>
              <Cell>{id}</Cell>
              <Cell>{name}</Cell>
              <Cell>{description}</Cell>
              <Cell>{external_url}</Cell>
              <Cell><a href={image}>{image}</a></Cell>
            </tr>
          ))}
        />
      </div>
    );
    }
  }

export default graphql(ItemDefinitionsQuery)(ItemDefinitions)
