import mongoose from 'mongoose';
import { IResponse } from '../interfaces/IResponse';

const qAndaSchema = new mongoose.Schema({
    _id: false,
    question: { type: String },
    answer: { type: String },
    timestamp: { type: Date }
});

const responsesSchema = new mongoose.Schema({
    _id: false,
    session: { type: String, required: true },
    qAndA: [qAndaSchema]
});

const responseSchema = new mongoose.Schema({
    botId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot',
        required: true
    },
    responses: [responsesSchema]
});

export default mongoose.model<IResponse>('Response', responseSchema);