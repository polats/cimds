import next from 'next'
import express from 'express'
import session from 'express-session'
import connectRedis from 'connect-redis'
import mongodb from 'mongodb'
import cookieParser from 'cookie-parser'

import Ooth from 'ooth'
import OothMongo from 'ooth-mongo'
import oothLocal from 'ooth-local'
import oothUser from 'ooth-user'
import oothFacebook from 'ooth-facebook'
import oothGoogle from 'ooth-google'
import oothTwitter from 'ooth-twitter'
import emailer from 'ooth-local-emailer'
import morgan from 'morgan'
import cors from 'cors'
import mail from './mail'

import passport from 'passport'
import ase from 'apollo-server-express'

const prepare = (o) => {
  if (o) {
    o._id = o._id.toString();
  }
  return o;
};

const start = async () => {

  try {
    const MongoClient = mongodb.MongoClient;
    const ObjectId = mongodb.ObjectId;

    const client = await MongoClient.connect(
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
      { useNewUrlParser: true },
    );
    const db = client.db(process.env.MONGO_DB);

    const Posts = db.collection('posts');
    const Comments = db.collection('comments');

    const typeDefs = [
      `
            type Query {
                me: User
                post(_id: ID!): Post
                posts: [Post]
                comment(_id: ID!): Comment
            }
            type User {
                _id: ID!
            }
            type Post {
                _id: ID!
                authorId: ID!
                title: String
                content: String

                author: User
                comments: [Comment]!
            }
            type Comment {
                _id: ID!
                postId: ID!
                authorId: ID
                content: String

                author: User
                post: Post
            }
            type Mutation {
                createPost(title: String, content: String): Post
                createComment(postId: ID!, content: String): Comment
            }
            schema {
                query: Query
                mutation: Mutation
            }
        `,
    ];

    const resolvers = {
      Query: {
        me: async (root, args, { userId }) => {
          if (!userId) {
            return null;
          }
          return {
            _id: userId,
          };
        },
        post: async (root, { _id }) => prepare(await Posts.findOne(ObjectId(_id))),
        posts: async (root, args, context) => (await Posts.find({}).toArray()).map(prepare),
        comment: async (root, { _id }) => prepare(await Comments.findOne(ObjectId(_id))),
      },
      Post: {
        comments: async ({ _id }) => (await Comments.find({ postId: _id }).toArray()).map(prepare),
      },
      Comment: {
        post: async ({ postId }) => prepare(await Posts.findOne(ObjectId(postId))),
      },
      Mutation: {
        createPost: async (root, args, { userId }, info) => {
          if (!userId) {
            throw new Error('User not logged in.');
          }
          args.authorId = userId;
          const { insertedId } = await Posts.insertOne(args);
          return prepare(await Posts.findOne(ObjectId(insertedId)));
        },
        createComment: async (root, args, { userId }) => {
          if (!userId) {
            throw new Error('User not logged in.');
          }
          args.authorId = userId;
          const { insertedId } = await Comments.insertOne(args);
          return prepare(await Comments.findOne(ObjectId(insertedId)));
        },
      },
    };

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

    app.use(
      session({
        name: 'app-session-id',
        store: new RedisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((userId, done) => {
      done(null, userId);
    });
    passport.deserializeUser((userId, done) => {
      done(null, userId);
    });

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

    const oothMongo = new OothMongo.OothMongo(db);

    const ooth = new Ooth.Ooth({
      app,
      path: '/auth',
      backend: oothMongo,
      session: session({
        name: 'app-session-id',
        secret: process.env.SESSION_SECRET,
        store: new RedisStore({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
        resave: false,
        saveUninitialized: true,
      }),
    });

    oothUser.default({ ooth });
    oothLocal.default({ ooth });

    if (process.env.MAIL_FROM) {
      emailer({
        ooth,
        from: process.env.MAIL_FROM,
        siteName: process.env.MAIL_SITE_NAME,
        url: process.env.MAIL_URL,
        sendMail: mail({
          apiKey: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        }),
      });
    }
    if (process.env.FACEBOOK_CLIENT_ID) {
      oothFacebook({
        ooth,
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      });
    }
    if (process.env.GOOGLE_CLIENT_ID) {
      oothGoogle({
        ooth,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      });
    }
    if (process.env.TWITTER_CLIENT_ID) {
      oothTwitter({
        ooth,
        clientID: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackUrl: process.env.TWITTER_CALLBACK_URL,
      });
    }

    app.get('*', (req, res) => handle(req, res));

    app.listen(process.env.PORT, process.env.HOST, function() {
      console.info(`itemdef server online at ${process.env.HOST}:${process.env.PORT}/`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
