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

const IndexPage = () => (
  <Page title="Itemdef Server">
    <Web3Initializer/>
    <Section heading="Upload Image / 3D File">
      <UploadDroppedFile />
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
  </Page>
)

export default IndexPage
