import { gql } from '@apollo/client';
//allows the client to query for the user
export const QUERY_ME = gql`
    query me  {
        me {
            _id
            username
            email
            password
            bookCount
            savedBooks{
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
}
`