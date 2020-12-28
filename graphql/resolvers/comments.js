const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../database/models/post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === "") {
        throw new UserInputError("Empty comments", {
          errors: {
            body: "Comment must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);

          await post.save();
          return post;
        } else
          throw new AuthenticationError(
            "You are not the owner of this comment"
          );
      } else throw new UserInputError("Post not found");
    },
  },
};