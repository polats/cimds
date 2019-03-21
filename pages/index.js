import Page from '../components/Page'
import Section from '../components/Section'
import AddItemDefinition from '../components/AddItemDefinition'
import UploadBlob from '../components/UploadBlob'
import UploadFile from '../components/UploadFile'
import UploadFileList from '../components/UploadFileList'
import Uploads from '../components/Uploads'

const IndexPage = () => (
  <Page title="Itemdef Server">
    <Section heading="Upload Image / 3D File">
      <UploadFile />
    </Section>
    <Section heading="Add Item Definition">
      <AddItemDefinition />
    </Section>
    <Section heading="Create Item Instance">
      <UploadFile />
    </Section>
    <Section heading="Uploads">
      <Uploads />
    </Section>
    <Section heading="Item Definitions">
      <Uploads />
    </Section>
    <Section heading="Item Instances">
      <Uploads />
    </Section>
  </Page>
)

export default IndexPage
