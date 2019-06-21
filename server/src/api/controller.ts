import { Request, Response } from 'express';
import * as autoBind from 'auto-bind';
import * as bcrypt from 'bcrypt';
import { User } from '../models';

export class Controller {
  constructor() {
    autoBind(this);
  }

  public login(req: Request, res: Response) {
    //
  }

  public register(req: Request, res: Response) {
    const { email, password } = req.body;
  }
}

export default new Controller();
