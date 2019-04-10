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

class UploadDroppedFileComponent extends React.Component {
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

/*
<form
  onSubmit={(e) => {
    e.preventDefault();
    mutate({
      variables: {
        title: this.title.value,
        content: this.content.value,
      },
    })
      .then(({ data }) => {
        if (onCreatePost) {
          onCreatePost();
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }}
>

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
        console.log(multipleUpload)
        console.log(proxy)
        proxy.writeQuery({ query: uploadsQuery, data })
      }
    })

*/


export default compose(withUser,graphql(UploadFileQuery))(UploadDroppedFileComponent)
