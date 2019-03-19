import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'
import { Table, Head, Cell } from './Table'

const Uploads = ({ data: { uploads = [] } }) => (
  <Table
    thead={
      <tr>
        <Head>Filename</Head>
        <Head>MIME type</Head>
      </tr>
    }
    tbody={uploads.map(({ _id, filename, contentType }) => (
      <tr key={_id}>
        <Cell><a href={"/file/" + filename}>{filename}</a></Cell>
        <Cell>{contentType}</Cell>
      </tr>
    ))}
  />
)

export default graphql(uploadsQuery)(Uploads)
