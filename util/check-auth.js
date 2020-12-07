const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const SECRET = process.env.SECRET;

/*
  @ Anonymous func  
      @ holds : context which is grabbed from posts.js
      @ task :  Makes sure the user has authorization by making sure the jwt is matched with the bearer from the header
      @ returns: the user models information such as => {username, email, createdAt}
*/
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired Token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]'");
  }
  throw new Error("Authentication header must be provided");
};
