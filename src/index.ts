import 'reflect-metadata'; // We need this in order to use @Decorators
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import bodyParser from 'body-parser';
import config from './config';
import Logger from './loaders/logger';
import mongooseLoader from './loaders/mongoose';
import routes from './api';

const app: Application = express();

if (!config.port) {
    process.exit(1);
}

mongooseLoader().then(db => {
  db.collections().then(collections => {
    // collections.forEach((v,i,c) => {
    //   Logger.debug(v.find());
    // })
    // Logger.debug(collections);
  }).catch(()=>{
    Logger.debug('db error');
    process.exit(1)
  })
})
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//statics
app.use(express.static(`${__dirname}/public/views`));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/cdn', express.static(__dirname + '/public/cdn'));

app.get('/', (req: Request, res: Response) =>
  res.sendFile('test.html')
);

app.listen(config.port, () => {
  Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
routes({ app });
app.use(errorHandler);
app.use(notFoundHandler);
