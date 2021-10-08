import { Container, Service, Inject } from 'typedi';
import { IUser, IUserInputDTO, IRole } from '../interfaces/IUser';
import User from '../models/User.model';
import logger from '../loaders/logger';
import bcrypt from 'bcrypt';
import AuthService from './auth.service';

@Service()
export default class UserService {

    public async SignIn(email: string, password: string): Promise<PromiseLike<{ user: IUser; token: string; }>> {
        const userRecord = await User.findOne({ email });
        if (!userRecord) {
            throw new Error('User not registered');
        }

        logger.debug('Checking password');
        const validPassword = await bcrypt.compare(password, userRecord.password);
        if (validPassword) {
            const authServiceInstance = Container.get(AuthService);
            const token = authServiceInstance.generateAuthToken(userRecord);
            return { user: userRecord, token: token };
        } else {
            throw new Error('Invalid Password');
        }
    }
    public async getUserByEmail(email: any): Promise<IUser> {
        return await User.findOne({ email: email })
    }

    public async createUser(user: IUserInputDTO): Promise<IUser> {
        logger.debug(`user.service: creating user ${JSON.stringify(user)}`);
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        let confirmCode = await bcrypt.hash(user.password, salt);
        return await User.create({
            ...user,
            confirmCode: confirmCode,
            lastLogin: new Date()
        });
    }

    public async updateUser(email: string, updateObj: IUser): Promise<IUser> {
        const filter = { 'email': email };
        const update = {
            'name': updateObj.name
        };
        return await User.findOneAndUpdate(filter, update, { new: true });
    }

    public async getUser(id: string): Promise<IUser> {
        // return await new Promise<IUser>((resolve, reject) => {
        //     User.findById(id).populate('bots').exec((err, user) => {
        //         if (err) return reject(null)
        //         else {
        //             User.populate(user.bots, {'path':'Bot'},(err, res) =>{
        //                 console.log(`got bot ${res}`)
        //             })

        //            return resolve(user);
        //         }
        //     });
        // });
        // await User.find({"_id": id }).populate({'path':'bots'}).exec(async(err,res) => {
        //     console.log(`x - > ${res}`)
        // })
        // await u.populate('bots').execPopulate();
        // const x = u.bots[0]

        return await User.findById(id)
            .then((data: IUser) => {
                return data;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    public async addBot(userEmail: string, botid: string, canEdit: boolean): Promise<any> {
        logger.info(`user.service: saving for user ${userEmail}, bot id ${botid}`)
        return await new Promise<any>((resolve, reject) => {
            const update = { 'botId': botid, 'canEdit': canEdit }
            User.updateOne({ 'email': userEmail }, { '$push': { 'bots': update } }).exec(function (err, updateRes) {
                if (err) return reject(err);
                else
                    return resolve(updateRes);
            });
        })
    }

    public async getBotIds(userId: string): Promise<any[]> {
        // console.log(userId)
        return new Promise<string[]>(async (resolve, reject) => {
            await User.findById(userId, 'bots').then((user: IUser) => {
                return resolve(user.bots);
            })
                .catch(e => {
                    logger.error(`user.service: error when getting bots for ${userId}`);
                    return reject([])
                });
        });
    }
}