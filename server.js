const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const dbConnection = require("./database");
const PORT = process.env.PORT || 4001;
const Post = require("./database/models/post");
const User = require("./database/models/user");

/*
  @ DESCRIPTION:  typeDefs is a function for graphQL that allows a
                  FE to be able to access specific data. 
                  On here we give the fields to what the POST, QUERY, or
                  SUB will hold inside of it. This way we can organize
                  the routes via this function.      
*/
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

/*
  @ DESCRIPTION:  This will be the resolve for either a 
                  query, mutation, or subscription being called from 
                  typeDefs. This pretty much is graphQLs controller.
*/
const resolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Connect our database to the server
dbConnection;

server.listen({ port: PORT }).then((res) => {
  console.log(`Server running at ${res.url}`);
});
