import fs from 'fs'
import apolloServerKoa from 'apollo-server-koa'
import promisesAll from 'promises-all'
import _ from 'lodash'
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

import ItemDefinition from './models/itemDefinition'
import ItemInstance from './models/itemInstance'

var gfs; // gridfs
var mc; // mongoose connection

const initDB = () => {
  Grid.mongo = mongoose.mongo
  mc = mongoose.connection;

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  mc.once('open', () => {
    gfs = Grid(mc.db)
  });

}

// Initialize DB
initDB()

const storeFS = ({ stream, filename, mimetype }) => {

  var writeStream = gfs.createWriteStream({
    filename: filename,
    mode: 'w',
    content_type: mimetype
  })

  stream
    .on('error', error => {
      reject(error)
    })
    .pipe(writeStream)

  return new Promise((resolve, reject) =>
      writeStream.on('error', error => reject(error))
      .on('close', file => resolve(file))
  )
}

const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const file = await storeFS({ stream, filename, mimetype })

  var obj = {
    id: file._id,
    filename: file.filename,
    mimetype: file.contentType,
    path: "/" + file._id
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

export async function getAllFiles() {
  const allFiles = await gfs.files.find({}).toArray()
  return allFiles
}

export default {
  Upload: apolloServerKoa.GraphQLUpload,

  // queries
  Query: {
    async uploads() {
      return await getAllFiles()
    },
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
