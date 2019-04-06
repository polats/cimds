import Layout from '../components/layout'
import withPage from '../providers/page'

export default withPage(() => (
  <Layout title="About Itemdef Server" page="about">
      <div className="container">
        <h2>About Itemdef Server</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
        <img src="/static/logo.png" style={{
          maxWidth: '100%',
          width: '200px'
        }}/>
      </div>
  </Layout>
))
