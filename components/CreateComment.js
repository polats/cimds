import gql from 'graphql-tag'
import { graphql } from 'react-apollo';
import { Component } from 'react'
import { compose } from 'recompose';
import { withUser } from 'ooth-client-react';

const CreateCommentQuery = gql`
  mutation($postId: ID!, $content: String!) {
    createComment(postId: $postId, content: $content) {
      _id
    }
  }
`;

class CreateCommentComponent extends React.Component {
  render() {
    const { user, mutate, onCreateComment, postId } = this.props;
    if (!user) {
      return (
        <p>
          <a href={`/login?next=/blog`}>log in to comment</a>.
        </p>
      );
    }
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({
            variables: {
              postId,
              content: this.content.value,
            },
          })
            .then(({ data }) => {
              if (onCreateComment) {
                onCreateComment();
              }
            })
            .catch((e) => {
              console.error(e);
            });
        }}
      >
        <div className="form-group">
          <textarea
            className="form-control"
            ref={(ref) => {
              this.content = ref;
            }}
          />
        </div>
        <button>Comment</button>
      </form>
    );
  }
}
export default compose(
  withUser,
  graphql(CreateCommentQuery),
)(CreateCommentComponent);
