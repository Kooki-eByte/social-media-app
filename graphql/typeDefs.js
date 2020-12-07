const gql = require("graphql-tag");
/*
  @ DESCRIPTION:  typeDefs is a function for graphQL that allows a
                  FE to be able to access specific data. 
                  On here we give the fields to what the POST, QUERY, or
                  SUB will hold inside of it. This way we can organize
                  the routes via this function.      
*/

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
  }
`;
