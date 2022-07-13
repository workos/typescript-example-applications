import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/index';
const cookieParser = require('cookie-parser');


dotenv.config();

const app = express();
const port = process.env.PORT;

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', router);


app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${port}`);
});