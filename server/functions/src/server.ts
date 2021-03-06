import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as http from 'http';
import * as jwt from 'express-jwt';
import { config } from './common';
import router from './api/router';

class Server {
  public app: express.Application = express();
  public httpServer: http.Server;
  private readonly jwtOptions = {
    secret: config.jwtSecret as string,
  };

  constructor() {
    this.app.use(cookieParser());
    this.app.use(bodyParser());
    this.app.use(cors({ credentials: true, origin: true }));
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        if (req.cookies && req.cookies.token) {
          req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        next();
      },
    );
    this.app.use(jwt(this.jwtOptions).unless({ path: config.publicApiPaths }));
    this.app.use(router);

    this.httpServer = http.createServer(this.app);
    this.initialize();
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

      mongoose.connect(config.mongodbUri as string, { useNewUrlParser: true });

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
