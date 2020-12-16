const { UserInputError } = require("apollo-server");

const Post = require("../../database/models/post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    likePost: async (_, { postId }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Checks to see if the user has already liked the post, If so then unlike the post
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // The user is liking the post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError("Post Not Found");
    },
  },
};
