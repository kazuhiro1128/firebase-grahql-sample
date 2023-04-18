import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolover";

const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.start().then(() => {
  server.applyMiddleware({app, path: "/"});
});

export const graphql = functions
    .region('asia-northeast1')
.https.onRequest(app);