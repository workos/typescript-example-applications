import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import router from './routes/index';


const app = express();
const port = 3000;

app.use("/", router);
app.use('/public', express.static('public'));


// start the Express server
app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at ${port}` );
} );
