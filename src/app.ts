import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';

import ErrorController from './controllers/ErrorController';
import createConnection from './database';
import { router } from './routes';

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use(ErrorController.execute);

export { app };
