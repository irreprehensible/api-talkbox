import { Schema, Document } from 'mongoose';

export interface IResponse extends Document {
    _id?: string;
    botId: string;
    responses: IResponses[];
}

export interface IqAndA {
    question: string;
    answer: string;
    timestamp: Date;
}

export interface IResponses {
    session: string;
    qAndA: IqAndA[];
}

export interface IResponseDTO {
    botId: string;
    session: string,
    responses: IResponses[];
}