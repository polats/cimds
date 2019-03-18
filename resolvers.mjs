import fs from 'fs'
import apolloServerKoa from 'apollo-server-koa'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import promisesAll from 'promises-all'
import shortid from 'shortid'
import _ from 'lodash'
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

import ItemDefinition from './models/itemDefinition'
import ItemInstance from './models/itemInstance'

const UPLOAD_DIR = './uploads'
const filedb = lowdb(new FileSync('db.json'))

var gfs; // gridfs

const initDB = () => {
  Grid.mongo = mongoose.mongo
  var mc = mongoose.connection;

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  mc.once('open', () => {
    gfs = Grid(mc.db)
  });

}

// Seed an empty DB.
initDB()
filedb.defaults({ uploads: [] }).write()

// Ensure upload directory exists.
mkdirp.sync(UPLOAD_DIR)

const storeFS = ({ stream, filename, mimetype }) => {

  var writeStream = gfs.createWriteStream({
    filename: filename,
    mode: 'w',
    content_type: mimetype
  })

  stream
    .on('error', error => {
      if (stream.truncated)
        // Delete the truncated file.
        fs.unlinkSync(path)
      reject(error)
    })
    .pipe(writeStream)

  return new Promise((resolve, reject) =>
      writeStream.on('error', error => reject(error))
      .on('close', file => resolve(file))
  )
}

const storeDB = file =>
  filedb
    .get('uploads')
    .push(file)
    .last()
    .write()

const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const file = await storeFS({ stream, filename, mimetype })

  var obj = {
    id: shortid.generate(),
    filename: file.filename,
    mimetype: file.contentType,
    path: "/" + filename
  }

  return obj
}

const addItemDefinition = (input) => {

  const newItemDefinition = new ItemDefinition({
    name: input.name,
    description: input.description
  })

  return newItemDefinition.save()
}

const addItemInstance = (input) => {

  const newItemInstance = new ItemInstance({
    def_id: input.def_id
  })

  return newItemInstance.save()
}

const getAllItems = () => {

  return ItemInstance.find({}).exec().then(itemInstances => {

    var itemDefIds = [];

     itemInstances.map(itemInstance => {
       itemDefIds.push(itemInstance.def_id)
     })

     var allItems = []
     var index = 1

     return ItemDefinition.find()
       .where('_id')
       .in(itemDefIds)
       .exec()
       .then(itemDefinitions => {

         itemDefIds.map(itemDefId => {
           var itemDefinition = itemDefinitions.find(obj => obj._id.equals(itemDefId))

            var item = {
              id: index++,
              name: itemDefinition.name,
              description: itemDefinition.description
            }

            allItems.push(item)
         })

         return allItems
       })
  })
}

export default {
  Upload: apolloServerKoa.GraphQLUpload,

  // queries
  Query: {
    uploads: () => {return filedb.get('uploads').value()},
    itemDefinitions: () => {return ItemDefinition.find({})},
    itemInstances: () => {return ItemInstance.find({})},
    allItems: () => getAllItems()
  },

  // mutations
  Mutation: {
    singleUpload: (obj, { file }) => processUpload(file),

    async multipleUpload(obj, { files }) {
      const { resolve, reject } = await promisesAll.all(
        files.map(processUpload)
      )

      if (reject.length)
        reject.forEach(({ name, message }) =>
          // eslint-disable-next-line no-console
          console.error(`${name}: ${message}`)
        )

      return resolve
    },

    addItemDefinition: (root, args) => addItemDefinition(args.input),
    addItemInstance: (root, args) => addItemInstance(args)
  }
}
