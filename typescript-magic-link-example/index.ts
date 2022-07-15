import express from 'express'
import dotenv from 'dotenv'
import 'dotenv/config'
import router from './routes/index';

dotenv.config()

const app = express();

const port = process.env.PORT;

app.use('/public', express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
