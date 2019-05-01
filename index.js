require('dotenv').config();

const next = require('next');
const express = require('express');
const session = require('express-session');
const connectRedis = require('connect-redis');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');
const cors = require('cors');

const passport = require('passport');
const ase = require('apollo-server-express');
const typeDefs = require('./types');
const resolvers = require('./resolvers');
const connection = require('./database');
const authenticate = require('./authentication');
const queries = require('./playgroundQueries');
const bodyParser = require('body-parser');
var tabProps = []

const ItemDefinition = require('./models/itemDefinition');
const ItemInstance = require('./models/itemInstance');

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

    app.use(morgan('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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
        url: process.env.REDIS_URL
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

    // get json of all item definitions
    app.get('/itemdefs', async (req, res) => {
      var imagePrefix = process.env.URL + "/file/";
      var itemDefs = await ItemDefinition.find({}).exec();
      var returnArray = [];
      itemDefs.map(itemDef => {
        var returnedItemDef = {
          ...JSON.parse(itemDef.otherProps),
          id: itemDef.id,
          name: itemDef.name,
          description: itemDef.description,
          external_url: itemDef.external_url,
          image: imagePrefix + itemDef.image
        }

        returnArray.push(returnedItemDef);
      })

      res.send(returnArray);
    });

    app.get('/tokenuri', async (req, res) => {
      var itemInstanceArray = await ItemInstance.find( {} ).exec();

      res.send(itemInstanceArray);
    });

    app.get('/tokenuri/:tokenId', async (req, res) => {
      var imagePrefix = process.env.URL + "/file/";
      var itemInstance = await ItemInstance.findOne( {token_id: req.params.tokenId} ).exec();

      var itemDef = await ItemDefinition.findOne( {id: itemInstance.def_id} ).exec();
      var tokenURI = {
        name: itemDef.name,
        description: itemDef.description,
        external_url: itemDef.external_url,
        image: imagePrefix + itemDef.image,

        ...itemInstance.details
      };

      res.send(tokenURI);
    });

    app.post('/addToken', async (req, res) => {
      try {
          var def_id = req.body.def_id;
        var token_id = req.body.token_id;
        var details = req.body.details;

        var newToken = new ItemInstance({
          def_id: def_id,
          token_id: token_id,
          details: details
        })

        var returnVal = await newToken.save();
        return returnVal;

      } catch (e) {
        console.log(e);
        res.send(e);
      }
    });



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
        maxFileSize: 10000000 // 10 MB
        // maxFiles: 20
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
