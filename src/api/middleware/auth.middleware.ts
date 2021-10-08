import { Request, Response, NextFunction } from "express";
import jwt, { decode } from 'jsonwebtoken';
import config from "../../config";

export const auth = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const token = request.header('x-auth-token').split(' ')[1];

    if (!token)
        return response.status(401).send('Access denied. No token provided');

    try {
        jwt.verify(token, config.jwtSecret, (err, verifiedToken) => {
            if (verifiedToken) {
                if (err)
                    response.status(400).send('Access denied. Invalid token');
                request.body.user = {
                    '_id': verifiedToken['_id'],
                    'name': verifiedToken['name'],
                    'email': verifiedToken['email'],
                    'role': verifiedToken['role'],
                };
            }
            else {
                response.status(400).send('Access denied. Invalid token');
            }
        });
        next();
    }
    catch (ex) {
        response.status(400).send('Access denied. Invalid token');
    }
}