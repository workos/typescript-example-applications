import express from "express";
import router from "./routes/index";

const app = express();
const port = 3000;


app.use("/", router);

// start the Express server
app.listen( port, () => {
  // tslint:disable-next-line:no-console
  console.log( `server started at ${port}` );
} );
