import { Router, Request, Response, NextFunction } from 'express';
import config from '../../config';
import logger from '../../loaders/logger';
import { Container } from 'typedi';
import _ from 'lodash';
import BotService from '../../services/bot.service';
import { auth } from '../middleware/auth.middleware';
import { IColorScheme } from '../../interfaces/IColorScheme';

const route = Router();

export default (app: Router) => {
    app.use(`${config.api.prefix}/colorscheme`, route);

    route.get('/', auth, (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`colorscheme.Route: Called default GET returning all color schemes`)
            const botServiceInstance = Container.get(BotService);
            botServiceInstance.getColorSchemes()
                .then((colorschemes: IColorScheme[]) => {
                    return res.status(200).json(colorschemes);
                })
                .catch((e) => {
                    logger.error('colorscheme.Route: getting colorscheme 🔥 error: %o', e);
                })
        }
        catch (e) {
            logger.error('colorscheme.Route: getting colorscheme 🔥 error: %o', e);
            return next(e);
        }

    });

    route.post('/', auth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info(`colorscheme.Route: creating colorscheme ${JSON.stringify(req.body.colorscheme.name)} req -> ${req}`);
            const botServiceInstance = Container.get(BotService);
            logger.debug(`colorscheme.Route: calling create colorscheme`)

            await botServiceInstance.createColorScheme(req.body.colorscheme.name).then(async (colorscheme: IColorScheme) => {
                logger.info('Color Schemes created');
                return res.status(200).json(`{'message':'colorscheme is created. can be found at with id ${colorscheme.id}', 'api get endpoint to get all colorschemes':'/'}`);
            }, (err) => {
                const msg = `colorscheme.Route: 🔥 error recieved when creating a colorscheme ${req.body.colorscheme.name} with error-> ${err}`;
                logger.error(msg);
                return res.status(400).send(msg);
            });
        }
        catch (e) {
            logger.error('colorscheme.Route: error creating a colorscheme 🔥 error: %o', e);
            return next(e);
        }
    });
}