const typeDefs = `
    type User {
        _id:ID!
        username: String!
        email: String!
        password: String
        bookCount: Int
        savedBooks: [Book] 
    }

    type Book {
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type Query{
        me: [User]
    }

    input saveBookInput{
        bookId: String!
        authors: [String]
        description: String!
        image: String
        link: String
        title: String!
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!,email: String!, password: String!): Auth
        saveBook(saveBookInput): User
        removeBook(bookId: bookId): User
    }
`

module.exports = typeDefs;