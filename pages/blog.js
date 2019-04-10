import Layout from '../components/layout';
import withPage from '../providers/page';
import Blog from '../components/Blog'

export default withPage(() => (
  <Layout title="Blog" page="dashboard">
    <div className="container">
      <h1>Blog</h1>
      <p>This is a sample blog to demonstrate ooth-graphql integration.</p>
      <p>
        You can explore the graphql api with <a href="/api">graphiql</a>. Note how even via graphiql you can create posts
        only after registering/logging in.
      </p>
      <Blog />
    </div>
  </Layout>
));
