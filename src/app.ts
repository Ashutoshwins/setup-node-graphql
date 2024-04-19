import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import compression from "compression";
import { json } from "body-parser";
import { connect, ConnectOptions } from "mongoose";
import { executableSchema as schema } from "./graphql/schema";
import { MONGO_DB_CONNECTION_STRING, PORT } from "./env";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled
} from "apollo-server-core";
import authenticate from "./middlewares/authenticate";
import {logger} from './utils/enums/logger'
const sendmail = require('sendmail')();
export default class App {
  public app: Application;
  public port: number;
  constructor(port = +PORT) {
    this.app = express();
    this.port = port;
    this.connectToMongo();
    this.initializeMiddlewares();
    this.initializeApollo();
    // this.app.use();
  }

  private connectToMongo() {
    connect(`${MONGO_DB_CONNECTION_STRING}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    } as ConnectOptions)
      .then(() => {
        console.log("Connected to MongoDB...");
      })
      .catch((e) => {
        console.log("There was an error connecting to MongoDB:");
        console.error(e);
      });
  }

  private initializeMiddlewares() {
    this.app.use(compression());
    this.app.use(json());
    this.app.use(authenticate);

  }

  private async initializeApollo() {
    const setHttpPlugin = {
      async requestDidStart() {
        return {
          async willSendResponse({ response }) {
            if (response?.errors?.length > 0) {
              const code = Number(response?.errors[0]?.extensions?.code) || 400;
              response.http.status = code;
            }
          }
        };
      }
    };
    const server = new ApolloServer({
      // uploads: true,
      schema,
      context: (request: any) => ({
        req: request.req
        // res: request.res,
      }),
      plugins: [
        process.env.NODE_ENV === "production"
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),

        setHttpPlugin
      ]
    });

    this.app.get("/", (_, res) => {
      sendmail({
        from: 'ashutoshkumarwins@yopmail.com',
        to: 'tew@yopmail.com',
        subject: 'test sendmail',
        html: 'dsdgsfjdshgf',
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });

      res.status(200).send("Api Server is running...");
    });

    await server.start();
    server.applyMiddleware({ app: this.app });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log("infooo", `App listening on the port ${this.port}`);
    });
  }
}
