import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import { compose } from 'recompose';
import { withUser } from 'ooth-client-react';

const CreatePostQuery = gql`
  mutation($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      _id
    }
  }
`;
class CreatePostComponent extends React.Component {
  render() {
    const { user, mutate, onCreatePost } = this.props;
    if (!user) {
      return (
        <p>
          <a href={`/login?next=/blog`}>log in to write a post</a>.
        </p>
      );
    }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({
            variables: {
              title: this.title.value,
              content: this.content.value,
            },
          })
            .then(({ data }) => {
              if (onCreatePost) {
                onCreatePost();
              }
            })
            .catch((e) => {
              console.error(e);
            });
        }}
      >
        <h2>Write post</h2>
        <div className="form-grouip">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            ref={(ref) => {
              this.title = ref;
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            ref={(ref) => {
              this.content = ref;
            }}
          />
        </div>
        <button>Create</button>
      </form>
    );
  }
}
export default compose(
  withUser,
  graphql(CreatePostQuery),
)(CreatePostComponent);
