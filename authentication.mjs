import mongodb from 'mongodb'
import session from 'express-session'

import Ooth from 'ooth'
import OothMongo from 'ooth-mongo'
import oothLocal from 'ooth-local'
import oothUser from 'ooth-user'
import oothFacebook from 'ooth-facebook'
import oothGoogle from 'ooth-google'
import oothTwitter from 'ooth-twitter'
import emailer from 'ooth-local-emailer'

  const authenticate = async (app, sessionArgs) => {

  const MongoClient = mongodb.MongoClient;
  const ObjectId = mongodb.ObjectId;

  const client = await MongoClient.connect(
    `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
    { useNewUrlParser: true },
  );

  const db = client.db(process.env.MONGO_DB);

  const oothMongo = new OothMongo.OothMongo(db);

  const ooth = new Ooth.Ooth({
    app,
    path: '/auth',
    backend: oothMongo,
    session: session(sessionArgs),
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

}

export default authenticate
