import { Schema, Document } from 'mongoose';
import { IBot } from './IBot';

export interface IAddress extends Document {
    street: string;
    city: string;
    postCode: string;
}

export interface IRole extends Document {
    roleName: string;
    roleDesc: string;
}

export interface IUser extends Document {
    _id?: string;
    active?: boolean;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: IAddress;
    role: IRole;
    verifiedEmail?: boolean;
    verifiedPhone?: boolean;
    created?: Date;
    modified?: Date;
    createdBy?: string;
    modifiedBy?: string;
    lastLogin?: Date;
    lastIP?: string;
    confirmCode: string;
    bots:[]
}
export interface IUserInputDTO {
    name: string;
    email: string;
    password: string;
    bots: [];
}