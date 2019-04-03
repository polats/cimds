import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'
import FileDropzone from './FileDropzone'

const UploadDroppedFile = ({ mutate }) => {
  const handleChange = (files) =>
    mutate({
      variables: { files },
      update(
        proxy,
        {
          data: { multipleUpload }
        }
      ) {
        const data = proxy.readQuery({ query: uploadsQuery })
        data.uploads.push(...multipleUpload)
        proxy.writeQuery({ query: uploadsQuery, data })
      }
    })

  return (
    <div>
      <FileDropzone type="file" multiple onChange={handleChange}/>
    </div>
  )
}

export default graphql(gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      _id
      filename
      contentType
    }
  }
`)(UploadDroppedFile)
