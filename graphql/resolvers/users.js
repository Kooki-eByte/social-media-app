const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/user");
const SECRET = process.env.SECRET;
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

/*
  @ generateToken : generates a web token for each user 
      @ args : a successfully registered user
      @ task :  create a jwt
      @ returns: a String of random jumbled up stuff to generate a unique token
*/
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET,
    {
      expiresIn: "1h",
    }
  );
}

/*
  @ DESCRIPTION: Mutation allows for us to create, update, or delete
  @ register :  a type of mutation we created on typeDefs to store a 
                type of RegisterInput. 
      @ holds : username, password, confirmPassword, email
      @ task :  Validate user data, Make sure sure doesnt already exist
                Hash password and create auth token
      @ returns: {users _docs,
                  specific user id,
                  token}
*/
module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username: username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        password,
        confirmPassword,
        email
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Make sure user doesnt already exist
      const user = await User.findOne({ username: username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      // Hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
  Query: {
    async getUser() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
