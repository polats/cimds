import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import CreatePost from './CreatePost'
import CreateComment from './CreateComment'

const PostsQuery = gql`
  query {
    posts {
      _id
      authorId
      title
      content
      comments {
        _id
        authorId
        content
      }
    }
  }
`

class BlogComponent extends React.Component {

  render() {
    const {
      data: { loading, posts, refetch },
    } = this.props;
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <CreatePost onCreatePost={refetch} />
        <h2>Posts</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts &&
            posts.map((post) => (
              <li key={post._id}>
                <h3>{post.title}</h3>
                <div>{post.content}</div>
                <h4>Comments</h4>
                <CreateComment postId={post._id} onCreateComment={refetch} />
                {post.comments.map((comment) => (
                  <div key={comment._id}>
                    <span>From: {comment.authorId}</span>
                    <div>{comment.content}</div>
                  </div>
                ))}
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default graphql(PostsQuery)(BlogComponent);
