const postsResolvers = require("./posts");
const usersResolvers = require("./users");

/*
  @ DESCRIPTION:  This will be the resolve for either a 
                  query, mutation, or subscription being called from 
                  typeDefs. This pretty much is graphQLs controller.
*/

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
