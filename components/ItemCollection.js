import { graphql } from 'react-apollo'
import allItemsQuery from '../queries/allItems'
import { Table, Head, Cell } from './Table'

const ItemCollection = ({ data: { allItems = [] } }) => (
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
    tbody={allItems.map(({ instance_id, id, name, description, external_url, image }) => (
      <tr key={instance_id}>
        <Cell>{id}</Cell>
        <Cell>{name}</Cell>
        <Cell>{description}</Cell>
        <Cell>{external_url}</Cell>
        <Cell><a href={image}>{image}</a></Cell>
      </tr>
    ))}
  />
)

export default graphql(allItemsQuery)(ItemCollection)
