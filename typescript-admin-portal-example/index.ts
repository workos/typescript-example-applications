import express from "express";
import router from "./routes/index";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use("/", router);
app.use('/public', express.static('public'));

// start the Express server
app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at ${port}` );
} );
