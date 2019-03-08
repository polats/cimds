import apolloServerKoa from 'apollo-server-koa'
import Koa from 'koa'
import resolvers from './resolvers'
import typeDefs from './types'

import mount from 'koa-mount'
import graphqlHTTP from 'koa-graphql'
import cors from '@koa/cors'

import schema from './graphql/schema';
import initDB from './database';

initDB();

const app = new Koa();

app.listen(process.env.PORT || 9000);

app.use(cors());

app.use(mount('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
})))

app.on('error', err => {
  log.error('server error', err)
});
