import Comment from './models/comment'
import Post from './models/post'
import User from './models/user'

export default {
  Query: {
    me: (root, args, {userId}) => {
      if (!userId) {
        return null;
      }
      return {
        _id: userId,
      };
    },
    post: (root, {postId} ) => { return Post.findOne( {_id: postId} ) } ,
    posts: () => { return Post.find( {} ) },
    comment: (root, {commentId}) => { return Comment.findOne( {_id: commentId} ) },

    /*
    async uploads() {
      return await getAllFiles()
    },

    itemDefinitions: () => { return ItemDefinition.find( {} ) },
    itemInstances: () => { return ItemInstance.find( {} ) },
    allItems: () => getAllItems()
    */
  },

  Post: {
    comments: ({ _id }) => {return Comment.find( { postId: _id }) }
  },

  Comment: {
    post: ({ postId }) => { return Post.findOne( { _id: postId }) },
  },

  Mutation: {
    createPost: (root, args, { userId }, info) => {
      if (!userId) {
        throw new Error('User not logged in.');
      }

      const newPost = new Post({
        authorId: userId,
        ...args
      })

      return newPost.save()
    },

    createComment: (root, args, { userId }) => {
      if (!userId) {
        throw new Error('User not logged in.');
      }
      args.authorId = userId;

      const newComment = new Comment({
        authorId: userId,
        ...args
      })

      return newComment.save()
    },

    /*
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
    addItemInstance: (root, args) => addItemInstance(args.input)
    */
  }
}
