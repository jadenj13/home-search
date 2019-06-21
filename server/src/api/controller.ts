import { Request, Response } from 'express';

export class Controller {
  public example(req: Request, res: Response) {
    return res.json('example');
  }
}

export default new Controller();
