import Layout from '../components/layout'
import withPage from '../providers/page'

export default withPage(() => {
  return <Layout title="Itemdef Server" page="home">
        <div className="container">
          <div className="jumbotron">
              <h1>Itemdef Server</h1>
              <p>Create virtual items on the blockchain</p>
              <p><a className="btn btn-primary btn-lg" href="/about" role="button">Learn more &raquo;</a></p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <h2>About</h2>
              <p>Create virtual items on the blockchain</p>
              <p><a className="btn btn-default" href="/about" role="button">Learn more &raquo;</a></p>
            </div>
            <div className="col-md-4">
              <h2>User Accounts</h2>
              <p>Makes use of Ooth for authentication</p>
              <p><a className="btn btn-default" href="/register" role="button">Register &raquo;</a></p>
            </div>
            <div className="col-md-4">
              <h2>Open Source</h2>
              <p>This is an open source library</p>
              <p><a className="btn btn-default" href="https://github.com/polats/itemdef-server" role="button">GitHub &raquo;</a></p>
            </div>
          </div>
        </div>
    </Layout>
})
