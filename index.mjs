import next from 'next'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'

import morgan from 'morgan'
import cors from 'cors'
import mail from './mail'

import passport from 'passport'
import ase from 'apollo-server-express'
import typeDefs from './types'
import resolvers from './resolvers'
import connection from './database'
import authenticate from './authentication'

const start = async () => {

  try {

    const app = express();

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

    const server = new ase.ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({
        userId: req.user,
      }),
      playground: {
        settings: {
          'editor.cursorShape': 'line',
        },
      },
    });

    server.applyMiddleware({
      app,
      path: '/api'
    });

    const nextApp = next({
      dev: process.env.NODE_ENV !== 'production',
    });
    const handle = nextApp.getRequestHandler();

    await nextApp.prepare();

    app.get('*', (req, res) => handle(req, res));

    app.listen(process.env.PORT, process.env.HOST, function() {
      console.info(`itemdef server online at ${process.env.HOST}:${process.env.PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
