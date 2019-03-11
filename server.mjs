import apolloServerKoa from 'apollo-server-koa'
import Koa from 'koa'
import resolvers from './resolvers'
import typeDefs from './types'
import queries from './playgroundQueries'

import cors from '@koa/cors'
import serve from 'koa-static'
import mongoose from 'mongoose';

const initDB = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  mongoose.connection.once('open', () => {
    console.log('connected to database');
  });
}

var tabProps = []

// create default query & mutation tabs based on playgroundQueries.js
const prepareTabs = () => {
  Object.getOwnPropertyNames(queries).map(queryName => {
      var tab = {
        name: queryName,
        endpoint: "",
        query: queries[queryName]
      }
      tabProps.push(tab)
    }
  )
}


// start initialization
initDB()
prepareTabs()

const app = new Koa();

const server = new apolloServerKoa.ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    tabs: tabProps
  },
  uploads: {
    // Limits here should be stricter than config for surrounding
    // infrastructure such as Nginx so errors can be handled elegantly by
    // graphql-upload:
    // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20
  }
})

server.applyMiddleware({ app })

app.use(cors());
app.use(serve(process.cwd() + '/public'));

app.listen(process.env.PORT || 9000);

app.on('error', err => {
  log.error('server error', err)
});
