import { Schema, Document } from 'mongoose';

export interface IColorScheme extends Document {
    _id?: string;
    active?: boolean;
    name: string;
    themePrimaryColor: string, //background color of items
    themeBoxShadowColor: string, //box shadow color of items
    themeTextShadowColor: string, //text shadow color of items
    themeHoverBackGroundColor: string, //button hover color of items and text result color
    themeTextWrapperColor: string //dependent color on background of the main chat window (bot.talkBoxParams.talkboxBackGround). refer :getLightColorFromBg
}