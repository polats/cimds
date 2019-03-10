import apolloServerKoa from 'apollo-server-koa'
import Koa from 'koa'
import resolvers from './resolvers'
import typeDefs from './types'
import queries from './playgroundQueries'

import cors from '@koa/cors'
import serve from 'koa-static'

const app = new Koa();



const server = new apolloServerKoa.ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: {
    tabs:
    [
      {
        name: "Item Definitions",
        endpoint: "",
        query: queries.itemDefinitions

      },
      {
        name: "Item Instances",
        endpoint: "",
        query: queries.itemInstances

      },
      {
        name: "Look Up Item",
        endpoint: "",
        query: queries.lookUpItem

      }
    ]
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
