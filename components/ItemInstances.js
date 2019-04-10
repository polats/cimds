import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import { Table, Head, Cell } from './Table'
import AddItemInstance from './AddItemInstance'

const ItemInstancesQuery = gql`
  query itemInstances {
    itemInstances {
      id
      token_id
      def_id
    }
  }`


class ItemInstances extends React.Component {
  render() {
    const {
      data: { loading, itemInstances, refetch },
    } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
      <AddItemInstance onAdd={refetch} />      
      <Table
        thead={
          <tr>
            <Head>ID</Head>
            <Head>token_id</Head>
            <Head>def_id</Head>
          </tr>
        }
        tbody={itemInstances && itemInstances.map(({ id, token_id, def_id }) => (
          <tr key={id}>
            <Cell>{id}</Cell>
            <Cell>{token_id}</Cell>
            <Cell>{def_id}</Cell>
          </tr>
        ))}
      />
    </div>
  )
  }
}

export default graphql(ItemInstancesQuery)(ItemInstances)
