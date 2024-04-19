import { gql } from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import userResolvers from "./resolvers/user.resolver";
import { merge } from "lodash";

const typeDefs = gql`

  type Authentication {
    user: User!
    token: String!
  }
  type User {
    _id: String
    firstName: String
    lastName: String
    email: String
    password:String
    role:String
    isActive:Boolean
    isVerified:Boolean
    isSubscribed:Boolean
  }
  input UserInput {
    _id: String
    firstName: String
    lastName: String
    email: String
    password:String
    role:String
    isActive:String
    isVerified:Boolean
    verifyEmailCode: String
    isSubscribed:Boolean

  
  }
#################################### Query & mutation ################################

  type Query {
    getUser(_id: String!): User

  }

  type Mutation {
    register(user:UserInput): Authentication
    login(email:String,password:String): Authentication
  }
`;

export const resolvers = merge(userResolvers);

export const executableSchema = makeExecutableSchema({
  resolvers: {
    // Upload: GraphQLUpload,
    ...resolvers
  },
  typeDefs
});
