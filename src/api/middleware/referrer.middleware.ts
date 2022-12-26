import { Request, Response, NextFunction } from "express";
import { Container } from 'typedi';
import BotService from '../../services/bot.service';
import { IBot } from '../../interfaces/IBot';
import logger from '../../loaders/logger';

export const referrer = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const referrer = request.header('x-bot-referrer');

        if (!referrer)
            return response.status(401).send('Access denied. No referrer provided');
        if (referrer.length == 0) {
            logger.debug(`No referrer defined for bot with ID : ${request.body.bot.id} moving on...`);
            next();
        }
        else if (referrer.indexOf('srcdoc') > -1) {
            logger.debug(`Called from within.... moving on...`);
            next();
        }
        else {
            const botServiceInstance = Container.get(BotService);
            botServiceInstance.getBot(request.body.bot.id)
                .then((bot: IBot) => {
                    let res = bot.referrers.filter((val) => {
                        return referrer.indexOf(val) > -1
                    });
                    if (res.length == 0 && referrer.indexOf(request.body.bot.id) < 0) {
                        throw new Error("Could not find referrer in bot details, please verify the security parameters");
                    }
                    else {
                        next();
                    }
                })
                .catch(err => { throw err })
        }
    }
    catch (ex) {
        response.status(400).send(`Access denied. Invalid referrer ${ex.message.length > 0 ? ex.message : ''}`);
    }
}