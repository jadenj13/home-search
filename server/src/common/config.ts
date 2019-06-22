import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

class Config {
  public readonly nodeEnv = process.env.NODE_ENV;
  public readonly port = this.normalizePort(process.env.PORT);
  public readonly mongodbUri = process.env.MONGODB_URI;
  public readonly jwtSecret = process.env.JWT_SECRET;
  public readonly publicApiPaths = this.getPublicApiPaths();

  constructor() {
    this.ensureRequiredVariables();
  }

  private ensureRequiredVariables() {
    // required environment variables
    ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET'].forEach(name => {
      if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
      }
    });
  }

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
    if (!process.env.PUBLIC_API_PATHS) {
      return [];
    }

    const paths = process.env.PUBLIC_API_PATHS.split(',').map(path => {
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
