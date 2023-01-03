import { Router, Request, Response, NextFunction } from 'express';
import config from '../../config';
import logger from '../../loaders/logger';
import { Container } from 'typedi';
import _ from 'lodash';
import { IBot, IBotInputDTO, botType } from '../../interfaces/IBot';
import BotService from '../../services/bot.service';
import UserService from '../../services/user.service';
import FileService from '../../services/file.service';
import { auth } from '../middleware/auth.middleware';
import { referrer } from '../middleware/referrer.middleware';
import { IqAndA, IResponseDTO, IResponses } from '../../interfaces/IResponse';

const route = Router();

export default (app: Router) => {
    app.use(`${config.api.prefix}/bots`, route);

    route.get('/me', auth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`bots.Route: Called bot get me with body -> ${JSON.stringify(req.body)}`)
            const botServiceInstance = Container.get(BotService);
            const userServiceInstance = Container.get(UserService);
            await userServiceInstance.getBotIds(req.body.user._id)
                .then(async (botIds: any[]) => {
                    logger.debug(`bots.Route: retrieved bot ids -> ${botIds} : for ${req.body.user.email}`)
                    if (botIds?.length == 0)
                        return res.status(404).send(`No Bots registered with ${req.body.user.email}`);
                    await botServiceInstance.getBots(botIds, req.body.user._id)
                        .then((bots: IBot[]) => {
                            console.log('got bots');
                            return res.status(200).json(bots);
                        })
                        .catch((e) => {
                            logger.error('bots.Route: 🔥 error: %o', e);
                            return res.status(500).send(`Error when retrieving bot for ${req.body.user.email} `);
                        })
                })
                .catch((e) => {
                    logger.error('bots.Route: 🔥 error: %o', e);
                    return res.status(500).send(`Error when retrieving bot for ${req.body.user.email} `);
                })
        }
        catch (e) {
            logger.error('bots.Route: 🔥 error: %o', e);
            return next(e);
        }
    });
    route.get('/:id', auth, (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`bots.Route: Called bot get id with param -> ${JSON.stringify(req.params)}`)
            const botServiceInstance = Container.get(BotService);
            botServiceInstance.getBot(req.params.id)
                .then((bot: IBot) => {
                    return res.status(200).json(bot);
                })
                .catch((e) => {
                    logger.error('bots.Route: getting bot id 🔥 error: %o', e);
                })
        }
        catch (e) {
            logger.error('bots.Route: getting bot id 🔥 error: %o', e);
            return next(e);
        }

    });
    route.post('/verify', referrer, (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`bots.Route: Called bot verify get id with param -> ${JSON.stringify(req.body.bot.id)}`)
            const botServiceInstance = Container.get(BotService);
            botServiceInstance.getBot(req.body.bot.id)
                .then((bot: IBot) => {
                    logger.debug('returning bot....');
                    return res.status(200).send(_.pick(bot, ['name', 'description', 'referrers']));
                })
                .catch((e) => {
                    logger.error('bots.Route: error in verify 🔥 error: %o', e);
                    return res.status(400).send('Could not get the bot details');
                })
        }
        catch (e) {
            logger.error('bots.Route: 🔥 error in verify: %o', e);
            return next(e);
        }
    });
    route.post('/referrer', referrer, (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`bots.Route: Called bot referrer get id with param -> ${JSON.stringify(req.body.bot.id)}`)
            const botServiceInstance = Container.get(BotService);
            botServiceInstance.getBot(req.body.bot.id)
                .then((bot: IBot) => {
                    logger.debug('returning bot....');
                    return res.status(200).send(bot);
                })
                .catch((e) => {
                    logger.error('bots.Route: error in referrer 🔥 error: %o', e);
                    return res.status(400).send('Could not get the bot details');
                })
        }
        catch (e) {
            logger.error('bots.Route: error in referrer 🔥 error: %o ', e);
            return next(e);
        }
    });
    route.post('/', auth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info(`bots.Route: creating bot ${JSON.stringify(req.body.bot)} req -> ${req}`)
            const botServiceInstance = Container.get(BotService);
            const newBot: IBotInputDTO = {
                name: req.body.bot.name,
                description: req.body.bot.description || '',
                conv: req.body.bot.conv || [{
                    id: "0",
                    text: "How are you",
                    type: "option",
                    responseValidation: null,
                    options: [
                        { text: "OK", value: "0", linkedQuestion: "00" },
                        { text: "Cool", value: "1", linkedQuestion: "01" },
                        { text: "Bad", value: "2", linkedQuestion: "02" },
                    ],
                    nextQuestion: null,
                    waitForReply: false
                },
                {
                    id: "00",
                    text: "That's Good",
                    type: "text",
                    responseValidation: null,
                    options: null,
                    nextQuestion: "3",
                    waitForReply: false
                },
                {
                    id: "01",
                    text: "That's Cool!",
                    type: "text",
                    responseValidation: null,
                    options: null,
                    nextQuestion: "3",
                    waitForReply: false
                },
                {
                    id: "02",
                    text: "That's Bad!",
                    type: "option",
                    responseValidation: null,
                    options: [
                        { text: "Im gay", value: "0" },
                        { text: "Im dying", value: "1" },
                        { text: "Just bored!", value: "2" },
                    ],
                    waitForReply: false
                },
                {
                    id: "66666-99999-00000",
                    text
                        : "This chat terminated abruply <br> Really sorry....<br> Please start over...",
                    type: botType.OPTION,
                    responseValidation: null,
                    options: [
                        { text: "Start Over", value: "0" },
                    ],
                    waitForReply: false
                }],
                firstQuestion: '0',
                referrers: [''],
                createdBy: req.body.user.email,
                modifiedBy: req.body.user.email
            };
            logger.debug(`bots.Route: calling create bot`)

            await botServiceInstance.createBot(newBot).then(async (bot: IBot) => {
                //update user with bot 
                const userServiceInstance = Container.get(UserService);
                await userServiceInstance.addBot(req.body.user.email, bot.id, true).then((res: any) => {
                    console.log(typeof (res))
                })
                return res.status(200).json(`{'message':'bot is created. can be found at with id ${bot.id}', 'api get endpoint':'/${bot.id}'}`);
            }, (err) => {
                const msg = `bots.Route: 🔥 error recieved when creating a bot ${_.pick(newBot, ['name'])} with error-> ${err}`;
                logger.error(msg);
                return res.status(400).send(msg);
            });
        }
        catch (e) {
            logger.error('bots.Route: error creating a bot 🔥 error: %o', e);
            return next(e);
        }
    });
    route.put('/', auth, async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.debug(`bots.Route: updating bot ${JSON.stringify(req.body.updateBotObj)} req -> ${req}`);
            const userServiceInstance = Container.get(UserService);
            await userServiceInstance.getBotIds(req.body.user._id)
                .then(async botIds => {
                    logger.debug(`got bots ${botIds}`);
                    //get bots for req.body.user._id
                    let canEdit = botIds.filter(id => {
                        //check if req.body.bot._id is present in user's bots
                        return id.botId == req.body.updateBotObj._id
                    })[0].canEdit;
                    logger.info(`user ${canEdit ? 'can edit' : 'cannot edit'} the bot`);
                    if (canEdit) {
                        //if so, check if he can edit
                        const botServiceInstance = Container.get(BotService);
                        await botServiceInstance.updateBot(req.body.user.email, req.body.updateBotObj)
                            .then(async updatedBot => {
                                if (req.body.publish) {
                                    logger.info(`publishing (wring the file) after update`);
                                    const fileServiceInstance = Container.get(FileService);
                                    await fileServiceInstance.publishTalkbox(updatedBot._id)
                                        .then(result => {
                                            if (result)
                                                res.status(200).send(`Updated Bot : ${updatedBot._id}`);
                                            else
                                                res.status(200).send(`Bot file was not updated! but the Bot was updated. Updated Bot : ${JSON.stringify(updatedBot)}`);
                                        })
                                    logger.info(`Updated bot : ${updatedBot._id}`)
                                }
                                else {
                                    res.status(200).send(`Updated Bot : ${updatedBot._id}`);
                                }
                            }, (err) => {
                                const msg = `bots.Route: 🔥 error recieved when updating a bot ${JSON.stringify(req.body.updateBotObj)} with error-> ${err}`;
                                logger.error(msg);
                                return res.status(400).send(msg);
                            })
                    }
                    else {
                        res.status(401).send(`User is 🔥not authorized🔥 to edit this bot`);
                    }
                })
                .catch((err) => {
                    const msg = `bots.Route: 🔥 error recieved when updating a bot ${JSON.stringify(req.body.updateBotObj)} with error-> ${JSON.stringify(err)}`;
                    logger.error(msg);
                    return res.status(400).send(msg);
                });

        }
        catch (e) {
            logger.error('bots.Route: error updating a bot🔥 error: %o', e);
            return next(e);
        }

    })
    route.post('/botresponse', referrer, async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info(`bots.Route: updating bot response ${JSON.stringify(req.body.botresponse)} req -> ${req}`);
            const botServiceInstance = Container.get(BotService);
            let qAndA: IqAndA = {
                question: req.body.botresponse.question,
                answer: req.body.botresponse.answer,
                timestamp: new Date(Date.now())
            }
            let reponses: IResponses = {
                session: req.body.botresponse.session,
                qAndA: [qAndA]
            }
            let resp: IResponseDTO = {
                botId: req.body.botresponse.botId,
                session: req.body.botresponse.session,
                responses: [reponses]
            }
            const updatedResponse = await botServiceInstance.updateResponse(resp);

            res.status(200).send(_.pick(updatedResponse, ['_id', 'name']));

        }
        catch (e) {
            logger.error('bots.Route: error updating a bot🔥 error: %o', e);
            return next(e);
        }
    })
}