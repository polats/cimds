import Layout from '../components/layout'
import withPage from '../providers/page'

import Page from '../components/Page'
import Section from '../components/Section'
import UploadBlob from '../components/UploadBlob'
import UploadDroppedFile from '../components/UploadDroppedFile'
import UploadFileList from '../components/UploadFileList'
import Uploads from '../components/Uploads'
import ItemDefinitions from '../components/ItemDefinitions'
import AddItemDefinition from '../components/AddItemDefinition'
import ItemInstances from '../components/ItemInstances'
import ItemCollection from '../components/ItemCollection'
import AddItemToCollection from '../components/AddItemToCollection'
import Web3Initializer from '../components/Web3Initializer'

import UploadFile from '../components/UploadFile'

export default withPage(() => (

  <Layout title="Items" page="items">
  <Page>
    {/*
      <Web3Initializer/>
    */}
    <div className="container">
      <Section heading="Upload Image / 3D File">
      {/*
        <UploadDroppedFile />
      */}
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
