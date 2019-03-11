import fs from 'fs'
import apolloServerKoa from 'apollo-server-koa'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import promisesAll from 'promises-all'
import shortid from 'shortid'
import _ from 'lodash'

import xd from './exampleData'
import ItemDefinition from './models/itemDefinition'

const UPLOAD_DIR = './uploads'
const db = lowdb(new FileSync('db.json'))

// Seed an empty DB.
db.defaults({ uploads: [] }).write()

// Ensure upload directory exists.
mkdirp.sync(UPLOAD_DIR)

const storeFS = ({ stream, filename }) => {
  const id = shortid.generate()
  const path = `${UPLOAD_DIR}/${id}-${filename}`
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file.
          fs.unlinkSync(path)
        reject(error)
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ id, path }))
  )
}

const storeDB = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write()

const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload
  const stream = createReadStream()
  const { id, path } = await storeFS({ stream, filename })
  return storeDB({ id, filename, mimetype, path })
}

const addItemDefinition = (args) => {

  const newItemDefinition = new ItemDefinition({
    name: args.name,
    description: args.description
  })

  return newItemDefinition.save();
}

const lookUpItem = (args) => {
  var def = _.filter(xd.itemDefinitions, {def_id: xd.itemInstances[args.id-1].def_id})[0];
  var obj = {
    id: args.id,
    name: def.name,
    description: def.description,
    image: def.description
  }
  return obj
}

const itemInstances = () => {
  return xd.itemInstances
}

export default {
  Upload: apolloServerKoa.GraphQLUpload,

  // queries
  Query: {
    uploads: () => db.get('uploads').value(),
    itemDefinitions: () => {return ItemDefinition.find({})},
    itemInstances: () => itemInstances(),
    lookUpItem: (obj, args) => lookUpItem(args)
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

    addItemDefinition: (root, args) => addItemDefinition(args.input)

  }
}
