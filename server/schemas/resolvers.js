const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, { username })=> {
            await User.findOne({ username });
        }
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
        saveBook: async (parent, {UserId, bookId, authors, description, image, link, title }) =>{
            return User.findOneAndUpdate(
                { _id: UserId },
                { $addToSet: { savedBooks: {bookId, authors, description, image, link, title} } },
                { new: true, runValidators: true }
            );
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