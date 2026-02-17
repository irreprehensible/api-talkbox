import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';
import Logger from './logger';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL)
  return connection.connection.db;
};
