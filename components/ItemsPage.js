import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import { Table, Head, Cell } from './Table'

import UploadDroppedFile from '../components/UploadDroppedFile'

/*
import Page from '../components/Page'
import Section from '../components/Section'
import UploadBlob from '../components/UploadBlob'
import UploadFileList from '../components/UploadFileList'
import Uploads from '../components/Uploads'
import ItemDefinitions from '../components/ItemDefinitions'
import AddItemDefinition from '../components/AddItemDefinition'
import ItemInstances from '../components/ItemInstances'
import ItemCollection from '../components/ItemCollection'
import AddItemToCollection from '../components/AddItemToCollection'
import Web3Initializer from '../components/Web3Initializer'


import UploadFile from '../components/UploadFile'
*/

const uploadsQuery = gql`
  query uploads {
    uploads {
      _id
      filename
      contentType
    }
  }
`

class ItemsPageComponent extends React.Component {
  render() {
    const {
      data: { loading, uploads, refetch },
    } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <UploadDroppedFile onUpload={refetch} />
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
      </div>
    );
  }
}

export default graphql(uploadsQuery)(ItemsPageComponent);

/*
export default withPage(() => (

  <Layout title="Items" page="items">
  <Page>
      <Web3Initializer/>
    <div className="container">
      <Section heading="Upload Image / 3D File">
        <UploadDroppedFile />
        <UploadFile />
      </Section>
      <Section heading="Create Item Definition">
        <AddItemDefinition />
      </Section>
      <Section heading="Add Item to Collection">
        <AddItemToCollection />
      </Section>
      <Section heading="Uploads">
        <Uploads />
      </Section>
      <Section heading="Item Definitions">
        <ItemDefinitions />
      </Section>
      <Section heading="Item Collection">
        <ItemInstances />
      </Section>
    </div>
  </Page>
</Layout>

))
*/
