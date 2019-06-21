import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as http from 'http';
import { config } from './common';
import router from './api/router';

class Server {
  public app: express.Application = express();
  public httpServer: http.Server;

  constructor() {
    this.app.use(cookieParser());
    this.app.use(bodyParser());
    this.app.use(router);

    this.httpServer = http.createServer(this.app);
  }

  private listen() {
    this.httpServer.listen(config.port, () =>
      console.log(`🚀 Server ready on port ${config.port}`),
    );
  }

  private connectToMongo() {
    return new Promise((resolve, reject) => {
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);

      mongoose.connect(config.mongodbUri, { useNewUrlParser: true });

      mongoose.connection.once('open', () => {
        console.log(`Connected to mongoDb`);
        resolve();
      });

      mongoose.connection.on('error', error => {
        console.log('mongo error');
        reject(error);
      });
    });
  }

  public async initialize() {
    try {
      await this.connectToMongo();
      this.listen();
    } catch (error) {
      throw error;
    }
  }
}

export default new Server();
