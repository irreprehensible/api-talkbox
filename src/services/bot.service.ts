import { Service, Inject } from 'typedi';
import { IBot, IBotInputDTO } from '../interfaces/IBot';
import Bot from '../models/Bot.model';
import User from '../models/User.model';
import Response from '../models/Response.model';
import ColorScheme from '../models/ColorScheme.model';
import logger from '../loaders/logger';
import { IResponse, IResponseDTO } from '../interfaces/IResponse';
import { IColorScheme } from '../interfaces/IColorScheme';

@Service()
export default class BotService {
    public async updateResponse(resp: IResponseDTO): Promise<IResponse> {
        const filter = { 'botId': resp.botId };
        const responseObj = await Response.findOne(filter);
        if (!responseObj) {
            logger.debug(`bot.service: No response for bot: ${resp.botId} so... creating it...`);
            return await Response.create({
                botId: resp.botId,
                responses: resp.responses
            });
        }
        else {
            logger.debug(`bot.service: found existing response for bot: ${resp.botId}`);
            const filteredResponse = responseObj.responses.filter((r) => {
                return r.session == resp.session;
            });
            if (filteredResponse.length > 0) {
                logger.debug(`bot.service: found existing session ${resp.session} in response for bot: ${resp.botId} so.... adding qAndA only`);
                //insert qAndA to responses qAndA then update
                const qAndAfilter = { 'botId': resp.botId, 'responses.session': resp.session };
                return await Response.findOneAndUpdate(qAndAfilter, { $addToSet: { 'responses.0.qAndA': resp.responses[0].qAndA } }, { new: false })
            }
            else {
                logger.debug(`bot.service: session not found for bot: ${resp.botId} so... adding responses`);
                // insert new session
                return await Response.findOneAndUpdate(filter, { $addToSet: { 'responses': resp.responses } }, { new: false });
            }
        }
    }
    public async updateBot(email: any, updateObj: any): Promise<IBot> {
        const filter = { '_id': updateObj._id };
        const update = {
            ...updateObj,
            modifiedBy: email,
            modified: Date.now()
        }
        return await Bot.findOneAndUpdate(filter, update, { new: true });
    }
    public async getBot(id: string): Promise<IBot> {
        return await Bot.findById(id)
            .then((data: IBot) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async createBot(bot: IBotInputDTO): Promise<IBot> {
        logger.debug(`bot.service: creating bot ${JSON.stringify(bot)}`);
        return await Bot.create({
            ...bot
        });
    }

    public async getBots(botIds: any, userId: string): Promise<IBot[]> {
        logger.debug(`bot.service: getting bots from ${botIds} for user : ${userId}`);
        return new Promise<IBot[]>(async (resolve, reject) => {
            if (botIds.length > 0) {
                let bots: IBot[] = [];
                const user = await User.findById(userId);
                for await (const bot of botIds) {
                    console.log(bot.botId)
                    await Bot.findById(bot.botId)
                        .then((bot: IBot) => {
                            //get bot permissions for user
                            user.bots.forEach(element => {
                                if (element['botId'] == bot.id) {
                                    bot.canEdit = element['canEdit']
                                }
                            });
                            bots.push(bot);
                        })
                        .catch((error: Error) => {
                            logger.error(`bot.service: error when getting bot for id ${bot.botId}, message: ${error.message}`);
                            // return reject([]);
                        });
                }
                logger.debug(`bot.service: just before sending: ${bots.length} recieved`);
                return resolve(bots)
            }
            else {
                return reject([]);
            }
        })

    }

    public async createColorScheme(colorSchemeName: string): Promise<IColorScheme> {
        logger.debug(`bot.service: creating ColorScheme with name as -> ${colorSchemeName}`);

        return await ColorScheme.create({
            name: colorSchemeName
        })
    }

    public async getColorSchemes(): Promise<IColorScheme[]> {
        logger.debug(`bot.service: getting all ColorSchemes `);
        return await ColorScheme.find();
    }
}