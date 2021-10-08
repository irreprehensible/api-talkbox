import { Service, Inject } from 'typedi';
import { IUser, IUserInputDTO, IRole } from '../interfaces/IUser';
import config from '../config';
import jwt from 'jsonwebtoken';

@Service()
export default class AuthService {

    public generateAuthToken(user: IUser): string {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            exp: exp.getTime() / 1000,
        }
            , config.jwtSecret
        );
    }
    public getUserFromToken(token: string): any {
        return jwt.verify(token, config.jwtSecret);
    }
}