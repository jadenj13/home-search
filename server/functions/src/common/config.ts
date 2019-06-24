import * as dotenv from 'dotenv';
import * as functions from 'firebase-functions';

dotenv.config();

class Config {
  public readonly nodeEnv = functions.config().api.node_env;
  public readonly port = this.normalizePort(functions.config().api.port);
  public readonly mongodbUri = `mongodb+srv://user:${
    functions.config().api.mongo_password
  }@cluster0-eifgq.mongodb.net/home-search?retryWrites=true&w=majority`;
  public readonly jwtSecret = functions.config().api.jwt_secret;
  public readonly publicApiPaths = this.getPublicApiPaths();

  private normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      throw new Error('port is not a number');
    }

    if (port >= 0) {
      return port;
    }

    throw new Error('port is less than 0');
  }

  private getPublicApiPaths() {
    if (!functions.config().api.public_api_paths) {
      return [];
    }

    const paths = functions
      .config()
      .api.public_api_paths.split(',')
      .map((path: string) => {
        const trimmedPath = path.trim();
        if (trimmedPath.startsWith('/') && trimmedPath.endsWith('/')) {
          const exp = trimmedPath.substring(1, trimmedPath.length - 2);
          return RegExp(exp);
        }
        return trimmedPath;
      });
    return paths;
  }
}

export default new Config();
