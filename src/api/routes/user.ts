import { Router, Request, Response, NextFunction } from 'express';
import config from '../../config';
import logger from '../../loaders/logger';
import { Container } from 'typedi';
import _ from 'lodash';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import { IUser, IUserInputDTO } from '../../interfaces/IUser';
import { validate } from '../../models/User.model';
import { auth } from '../middleware/auth.middleware';

const route = Router();

export default (app: Router) => {
  app.use(`${config.api.prefix}/users`, route);


  route.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`user.Route: Called user get id with param -> ${JSON.stringify(req.params)}`)
      const userServiceInstance = Container.get(UserService);
      const userResponse = userServiceInstance.getUser(req.params.id)
        .then((user: IUser) => {
          return res.status(200).json(user);
        })
        .catch((e) => {
          logger.error('user.Route: 🔥 error: %o', e);
        })
    }
    catch (e) {
      logger.error('user.Route: 🔥 error: %o', e);
      return next(e);
    }

  });

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser: IUserInputDTO = {
        name: req.body.user.name || req.body.user.email,
        email: req.body.user.email,
        password: req.body.user.password,
        bots: []
      }

      const userServiceInstance = Container.get(UserService);
      const authServiceInstance = Container.get(AuthService);

      const { error } = validate(req.body.user);
      if (error) return res.status(400).send(`user validation failed -> ${error.message} , original data sent-> ${JSON.stringify(error._original)}`);

      await userServiceInstance.getUserByEmail(req.body.user.email).then((user: IUser) => {
        if (user) return res.status(400).send('User already exists');
      });

      logger.debug(`user.Route: calling create user${newUser}`)
      await userServiceInstance.createUser(newUser).then((user: IUser) => {
        let token = authServiceInstance.generateAuthToken(user);
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
      }).catch(err => {
        const msg = `user.Route: 🔥 error revieved when creating a user ${_.pick(newUser, ['name', 'email'])} with error-> ${err}`;
        logger.error(msg);
        return res.status(400).send(msg);
      })
    }
    catch (e) {
      logger.error('user.Route: error creating a user 🔥 error: %o', e);
      return next(e);
    }
  });

  route.put('/', auth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`${JSON.stringify(req.body)} : update obj -> ${JSON.stringify(req.body.updateUserObj)}`);
      const userServiceInstance = Container.get(UserService);
      if (req.body.updateUserObj && req.body.user) {
        logger.debug(`calling update user for ${req.body.user.email}`);
        await userServiceInstance.updateUser(req.body.user.email, req.body.updateUserObj)
          .then((user: IUser) => {
            return res.status(200).send(`updated user: ${JSON.stringify(user)}`);
          })
          .catch(err => {
            const msg = `user.Route: 🔥 error revieved when updating a user ${req.body.email} with error-> ${err}`;
            logger.error(msg);
            return res.status(400).send(msg);
          })
      }
      else {
        res.status(400).send('User update details not found or incorrect');
      }
    }
    catch (e) {
      logger.error('user.Route: error updating a user🔥 error: %o', e);
      return next(e);
    }

  });

  route.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.debug(`user.Route: loggin user ->${JSON.stringify(req.body)}`)
      const { email, password } = req.body;
      const userServiceInstance = Container.get(UserService);
      const { user, token } = await userServiceInstance.SignIn(email, password);
      res.header('Access-Control-Expose-Headers', 'x-auth-token').header('x-auth-token', `Bearer ${token}`).send(_.pick(user, ['_id', 'name', 'email', 'role', 'avatar']));
    }
    catch (e) {
      logger.error('user.Route: error logging in a user🔥 error: %o', e);
      if (e.name.indexOf('MongooseError') > -1) {
        res.status(500).send(`Failed to connect to Database: ${e.message}`)
      }
      else {
        res.status(401).send('invalid login');
      }
    }
  });
};

