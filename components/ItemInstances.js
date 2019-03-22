import { graphql } from 'react-apollo'
import itemInstancesQuery from '../queries/itemInstances'
import { Table, Head, Cell } from './Table'

const ItemInstances = ({ data: { itemInstances = [] } }) =>
(
  <Table
    thead={
      <tr>
        <Head>ID</Head>
        <Head>collection_id</Head>
        <Head>def_id</Head>
      </tr>
    }
    tbody={itemInstances.map(({ id, collection_id, def_id }) => (
      <tr key={id}>
        <Cell>{id}</Cell>
        <Cell>{collection_id}</Cell>
        <Cell>{def_id}</Cell>
      </tr>
    ))}
  />
)

export default graphql(itemInstancesQuery)(ItemInstances)
