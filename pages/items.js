import Layout from '../components/layout'
import withPage from '../providers/page'
import ItemsPage from '../components/ItemsPage'

export default withPage(() => (

  <Layout title="Items" page="items">
    <div className="container">
      <ItemsPage />
    </div>
  </Layout>
))
