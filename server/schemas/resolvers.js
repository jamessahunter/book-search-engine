const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        //gets the user and their info
        me: async (parent, args, context)=> {
            if(context.user){
                return User.findOne({ _id: context.user._id });
            }
        }
    },

    Mutation: {
        //logins in a user and authenticates them
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
        //creates a user and gives them a token
        addUser: async (parent, {username, email, password}) => {
            console.log(username, email, password)
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        //finds all saved books for a user
        saveBook: async (parent, { bookId, authors, description, image, link, title }, context) =>{
            return User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: {bookId, authors, description, image, link, title} } },
                { new: true, runValidators: true }
            ).populate("savedBooks");
        },
        //removes a book from a users list of saved books
        removeBook: async (parent, { bookId }, context) => {
            return User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: { bookId} } },
                { new: true }
              );
        }
    }
}

module.exports = resolvers;