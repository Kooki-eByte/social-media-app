require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const dbConnection = require("./database");
const PORT = process.env.PORT || 4001;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// Connect our database to the server
dbConnection;

server
  .listen({ port: PORT })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
