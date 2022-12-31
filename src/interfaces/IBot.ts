import { Schema, Document } from 'mongoose';

export interface IBot extends Document {
    _id?: string;
    active?: boolean;
    name: string;
    description?: string;
    created?: Date;
    modified?: Date;
    createdBy?: string;
    modifiedBy?: string;
    conv: IConv[];
    startUpParams: IStartUpParams;
    talkBoxParams: ITalkboxParams;
    themeColors: IThemeColors;
    referrers: [string];
    canEdit?: boolean;
}
export interface ITalkboxParams extends Document {
    logoText: string;
    headerColor: string;
    headerText: string;
    closeButton: boolean;
    talkboxBackGround: string;
}
export interface IThemeColors extends Document {
    themePrimaryColor: string, //background color of items
    themeBoxShadowColor: string, //box shadow color of items
    themeTextShadowColor: string, //text shadow color of items
    themeHoverBackGroundColor: string, //button hover color of items and text result color
    themeTextWrapperColor: string //dependent color on background of the main chat window (bot.talkBoxParams.talkboxBackGround). refer :getLightColorFromBg
}
export interface IStartUpParams extends Document {
    startIconRounded: boolean;
    startIconBackground: string;
    startIconShadow: { required: boolean, style: string };
    startIconSize: { height: number, width: number };
    starIconPicture: string;
    startIconPosition: { left: boolean, bottom: number };
    startIconText: string;
    startIconDelay: number
}

export interface IConv {
    id: string;
    text: string;
    type: botType;
    responseValidation?: string;
    options?: any;
    waitForReply: boolean
}

export interface IBotInputDTO {
    name: string;
    description: string,
    conv: IConv[];
    referrers: [string];
    createdBy: string,
    modifiedBy: string
}

export enum botType {
    TEXT = 'text',
    MEETING = 'meeting',
    MULTI = 'multi',
    RATING = 'rating',
    OPTION = 'option',
}