import { IBot } from '../interfaces/IBot';
import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

const convOption = new mongoose.Schema({
    _id: false,
    text: { type: String },
    value: { type: String },
    linkedQuestion: { type: String }
});

const convSchema = new mongoose.Schema({
    _id: false,
    id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    responseValidation: { type: String },
    options: [convOption],
    nextQuestion: { type: String, required: false },
    waitForReply: { type: Boolean, default: false }
});

const botSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a full name'],
        index: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    description: { type: String },
    created: { type: Date, required: true, default: Date.now },
    modified: { type: Date, required: true, default: Date.now },
    createdBy: { type: String },
    modifiedBy: { type: String },
    firstQuestion: { type: String },
    startUpParams: {
        startIconRounded: { type: Boolean, default: false },
        startIconBackground: { type: String, default: '#599bb3' }, // themePrimaryColor
        startIconShadow: {
            required: { type: Boolean, default: true },
            style: { type: String, default: '0px 0px 21px 0px #276873' },
        },
        startIconSize: {
            height: { type: Number, default: 42 },
            width: { type: Number, default: 42 }
        },
        starIconPicture: { type: String, default: 'chat' },
        startIconPosition: {
            left: { type: Boolean, default: false },
            bottom: { type: Number, default: 72 }
        },
        startIconText: { type: String, default: 'Lets talk' },
        startIconDelay: { type: Number, default: 0 },
    },
    talkBoxParams: {
        headerText: { type: String, defult: 'Talkbox' },
        logoText: { type: String, default: 'talkbox by vaunz' },
        closeButton: { type: Boolean, default: true },
        headerColor: { type: String, default: '#599bb3' }, //themePrimaryColor
        talkboxBackGround: { type: String, default: '#FFF' }
    },
    themeColors: {
        themePrimaryColor: { type: String, default: '#599bb3' }, //background color of items
        themeBoxShadowColor: { type: String, default: '#2d4e5a' }, //box shadow color of items - ColorLuminance('#599bb3',-0.5)
        themeTextShadowColor: { type: String, default: '#3e6d7d' }, //text shadow color of items - ColorLuminance('#599bb3',-0.3)
        themeHoverBackGroundColor: { type: String, default: '#4c8498' }, //button hover color of items and text result color - ColorLuminance('#599bb3',-0.15)
        themeTextWrapperColor: { type: String, default: '#f5f5f5' }, //getLightColorFromBg(bot.talkBoxParams.talkboxBackGround);
    },
    conv: [convSchema],
    referrers: [String],
    canEdit: { type: Boolean, default: false },
    canAssign: { type: Boolean, default: false }
});

export default mongoose.model<IBot>('Bot', botSchema);