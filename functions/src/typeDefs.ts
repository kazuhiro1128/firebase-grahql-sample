import { gql } from 'apollo-server-express';
import { DocumentNode } from "graphql";

//スキーマ定義
export const typeDefs: DocumentNode = gql`
  type Query {
    tests: [Test]
    user(id:String!):User
    users:[User]
    threads(limit:Int, lastDocId:String!):Threads
    posts(threadId:String!, limit:Int, lastDocId:String!):Posts
  }

  type Mutation {
    registUser(id:String, name:String!, bio:String!):User
    updateUser(id:String!, name:String!, bio:String!):User
  }

  type Test {
    id: ID!
    text: String!
  }

  type User {
    id:ID!
    name:String!
    bio:String!
  }

  type Threads {
    threads:[Thread]
    lastDocId:String
  }

  type Thread {
    id:ID!
    title:String!
    body:String!
    createdAt:String!
    user:User!
  }

  type Posts {
    posts:[Post]
    lastDocId:String
  }

  type Post {
    id:ID!
    body:String!
    createdAt:String!
    user:User!
  }
`;