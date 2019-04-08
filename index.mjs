import next from 'next'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'

import morgan from 'morgan'
import cors from 'cors'

import passport from 'passport'
import ase from 'apollo-server-express'
import typeDefs from './types'
import resolvers from './resolvers'
import connection from './database'
import authenticate from './authentication'
import queries from './playgroundQueries'

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

const start = async () => {

  try {

    // start initialization
    prepareTabs()

    const app = express();
    var router = express.Router()

    app.use(morgan('dev'));

    const corsMiddleware = cors({
      origin: process.env.ORIGIN_URL,
      credentials: true,
      preflightContinue: false,
    });

    app.use(corsMiddleware);
    app.options(corsMiddleware);
    app.use(cookieParser());

    const RedisStore = connectRedis(session);

    const sessionArgs = {
      name: 'app-session-id',
      store: new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }

    app.use(
      session(sessionArgs),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((userId, done) => {
      done(null, userId);
    });
    passport.deserializeUser((userId, done) => {
      done(null, userId);
    });

    await authenticate(app, sessionArgs);

    const nextApp = next({
      dev: process.env.NODE_ENV !== 'production',
    });
    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    // Retrieve uploaded file
    app.get('/file/:filename', async (req, res) => {

      var findFile = () => {
        return new Promise((resolve, reject) => {
          connection.gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
            err ? reject(err)
                : resolve(files[0])
              });
            });
        };

      var file = await findFile();

      var body = ''

      if(!file){
        res.status(404)
        res.send(body)
      }

      else {

        const readstream = connection.gfs.createReadStream({
            filename: file.filename
        });

        res.status(200)
        res.type(file.contentType)
        readstream.pipe(res)
      }

    });

    const server = new ase.ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        userId: req.user,
      }),
      playground: {
        tabs: tabProps
      },
      uploads: {
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20
      }
    });

    server.applyMiddleware({
      app,
      path: '/graphql'
    });

    var router = express.Router()
    app.get('*', (req, res) => handle(req, res) );
    app.use(router)


    app.listen(process.env.PORT, process.env.HOST, function() {
      console.info(`itemdef server online at ${process.env.HOST}:${process.env.PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
