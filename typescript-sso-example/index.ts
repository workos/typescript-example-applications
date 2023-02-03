import express, { Application } from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import router from './routes/index'

const app: Application = express()

const port: string = process.env.PORT || '8000'

app.use('/public', express.static('public'))

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(morgan('dev'))

app.use('/', router)

app.listen(port, (): void => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
