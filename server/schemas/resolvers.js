const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context)=> {
            console.log("context")
            console.log(context)
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select(
                  "-__v -password"
                );
                return userData;
              }
        
            //   throw new AuthenticationError("Not logged in");
    },
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError
            }
            const token = signToken(user);
            return { token, user }
        },
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookId, authors, description, image, link, title }, context) =>{
            console.log("context")
            console.log(context)
            return User.findOneAndUpdate(
                { _id: context.user },
                { $addToSet: { savedBooks: {bookId, authors, description, image, link, title} } },
                { new: true, runValidators: true }
            ).populate("savedBooks");
        },
        removeBook: async (parent, {UserId, bookId}) => {
            return User.findOneAndUpdate(
                { _id: UserId},
                { $pull: { savedBooks: { bookId} } },
                { new: true }
              );
        }
    }
}

module.exports = resolvers;