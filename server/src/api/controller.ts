import { Request, Response } from 'express';
import * as autoBind from 'auto-bind';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, Listing } from '../models';
import { config } from '../common';

interface IRequest extends Request {
  user?: any;
}

export class Controller {
  private readonly cookieOptions = {
    maxAge: 1000 * 60 * 60 * 60 * 365,
    httpOnly: true,
  };

  constructor() {
    autoBind(this);
  }

  public async login(req: IRequest, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('Missing required fields.');
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json('Email does not exist.');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json('Invalid password.');
      }

      const userJson = user.toJSON();
      delete userJson.password;

      const token = jwt.sign(userJson, config.jwtSecret);
      res.cookie('token', token, this.cookieOptions);

      return res.json(userJson);
    } catch (error) {
      console.error(error.stack);
      return res.sendStatus(400);
    }
  }

  public async register(req: IRequest, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('Missing required fields.');
    }

    const emailLower = email.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email: emailLower,
      password: passwordHash,
      role: 'user',
    });

    try {
      const savedUser = await user.save();

      const userJson = savedUser.toJSON();
      delete userJson.password;

      const token = jwt.sign(userJson, config.jwtSecret);
      res.cookie('token', token, this.cookieOptions);

      return res.json(userJson);
    } catch (error) {
      console.error(error.stack);
      return res.sendStatus(400);
    }
  }

  public getCurrentUser(req: IRequest, res: Response) {
    if (!req.cookies || !req.cookies.token) {
      return res.json();
    }

    try {
      const user = jwt.verify(req.cookies.token, config.jwtSecret);
      return res.json(user);
    } catch {
      return res.json();
    }
  }

  public logout(req: IRequest, res: Response) {
    res.cookie('token', '', { maxAge: 0 });
    return res.json();
  }

  public async addListing(req: IRequest, res: Response) {
    if (
      !req.body.address ||
      !req.body.askingPrice ||
      !req.body.ownersName ||
      !req.body.propertyDescription ||
      !req.body.coordinates ||
      !req.body.imageUrl ||
      !req.user._id
    ) {
      return res.status(400).json('Missing required information.');
    }

    const listingModel = new Listing({
      ...req.body,
      userId: req.user._id,
    });

    const listing = await listingModel.save();
    return res.json(listing);
  }
}

export default new Controller();
