import fs from 'fs'
import apolloServerKoa from 'apollo-server-koa'
import lowdb from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import mkdirp from 'mkdirp'
import promisesAll from 'promises-all'
import shortid from 'shortid'
import _ from 'lodash'

const UPLOAD_DIR = './uploads'
const db = lowdb(new FileSync('db.json'))

// example data
const itemDefinitions = [
  {
    id: "eWRhpRV",
    name: "Bard Armor",
    description: "Armor for Bards",
    image: "Bard_Armor.png",
  },
  {
    id: "23TplPdS",
    name: "Bard Lute",
    description: "Lute for Bards",
    image: "Bard_Lute.png"
  },
  {
    id: "46Juzcyx",
    name: "Bard Shortsword",
    description: "Shortsword for Bards",
    image: "Bard_Shortsword.png"
  }
];

const itemInstances =  [
  {
    id: "1",
    itemdef: "eWRhpRV"
  },
  {
    id: "2",
    itemdef: "46Juzcyx"
  },
  {
    id: "3",
    itemdef: "23TplPdS"
  },
  {
    id: "4",
    itemdef: "23TplPdS"
  },
  {
    id: "5",
    itemdef: "eWRhpRV"
  }
];

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
  console.log(args)
  return args;
}

const getItemInstance = (args) => {
  var def = _.filter(itemDefinitions, {id: itemInstances[args.id-1].itemdef})[0];
  return {id: args.id, itemdef: def}
}

export default {
  Upload: apolloServerKoa.GraphQLUpload,
  Query: {
    uploads: () => db.get('uploads').value(),
    itemDefinitions: () => {return itemDefinitions},
    getItemInstance: (obj, args) => getItemInstance(args)
  },
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
    addItemDefinition: (obj, args) => addItemDefinition(args)
  }
}
