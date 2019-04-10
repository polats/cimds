import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Component } from 'react'
import { compose } from 'recompose';
import { withUser } from 'ooth-client-react';

import uploadsQuery from '../queries/uploads'
import FileDropzone from './FileDropzone'

const UploadFileQuery = gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      _id
      filename
      contentType
    }
  }
`

class UploadDroppedFile extends React.Component {
  render() {
    const { user, mutate, onUpload } = this.props;

  return (
    <div>

      <FileDropzone type="file" multiple onChange={(files) => {
        mutate({
          variables: {
            files: files
          }
        })
        .then( ({data}) => {
          if (onUpload) {
            onUpload();
          }
        })
        .catch((e) => {
          console.error(e);
        });
      }}/>

    </div>
    )
  }
}

export default compose(withUser,graphql(UploadFileQuery))(UploadDroppedFile)
