import apolloServerKoa from 'apollo-server-koa'
import Koa from 'koa'
import Router from 'koa-router'
import resolvers from './resolvers'
import typeDefs from './types'
import queries from './playgroundQueries'

import cors from '@koa/cors'
import next from 'next'
import connection from './database'

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
prepareTabs()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const graphQLserver = new apolloServerKoa.ApolloServer({
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

app.prepare().then( () => {
  const server = new Koa();
  const router = new Router();

  graphQLserver.applyMiddleware({ app: server })

  server.use(cors());

  // Retrieve uploaded file
  router.get('/file/:filename', async ctx => {

    var findFile = () => {
      return new Promise((resolve, reject) => {
        connection.gfs.files.find({filename: ctx.params.filename}).toArray(function(err, files){
          err ? reject(err)
              : resolve(files[0])
            });
          });
      };

    var file = await findFile();

    if(!file){
      ctx.status = 404
      return
    }
    
    const readstream = connection.gfs.createReadStream({
        filename: file.filename
    });

    ctx.status = 200
    ctx.type = file.contentType
    ctx.body = readstream

  });

  router.get("*", async ctx => {
    if (!ctx.path.match(/graphql/)) {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    }
  });



  server.use(router.routes());

  server.listen(process.env.PORT || 3000);

  server.on('error', err => {
    console.log('server error', err)
  });



}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
