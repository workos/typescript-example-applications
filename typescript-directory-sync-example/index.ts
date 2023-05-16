import express, { Application, Request, Response } from 'express'
import { WorkOS, Directory, Group, User, Webhook } from '@workos-inc/node'
import { List } from '@workos-inc/node/lib/common/interfaces/list.interface'
import { Server, Socket } from 'socket.io'
import morgan from 'morgan'
import 'dotenv/config'

const app: Application = express()
const port: string = process.env.PORT || '8000'
const workos: WorkOS = new WorkOS(process.env.WORKOS_API_KEY)

app.use('/public', express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(morgan('dev'))

process.on('unhandledRejection', (reason, p) => {
    throw reason
})

const server = app.listen(port, (): void => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})

const io: Server = new Server(server)

io.on('connection', (socket: Socket) => {
    console.log('connected')

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})

app.get('/', async (req: Request, res: Response) => {
    let before: string | undefined = req.query.before
        ? req.query.before.toString()
        : undefined
    let after: string | undefined = req.query.after
        ? req.query.after.toString()
        : undefined

    const directories: List<Directory> =
        await workos.directorySync.listDirectories({
            limit: 5,
            before: before,
            after: after,
            order: undefined,
        })

    before = directories.list_metadata.before
    after = directories.list_metadata.after

    res.render('index', {
        title: 'Home',
        directories: directories.data,
        before: before,
        after: after,
    })
})

app.get('/directory', async (req: Request, res: Response) => {
    const directories: List<Directory> =
        await workos.directorySync.listDirectories()
    const directory: Directory = directories.data.filter(
        (directory: Directory) => {
            return directory.id == req.query.id
        }
    )[0]

    res.render('directory.ejs', {
        directory: directory,
        title: 'Directory',
    })
})

app.get('/users', async (req, res) => {
    let directoryId: string | undefined
    if (typeof req.query.id === 'string') {
        directoryId = req.query.id
    }

    const users: List<User> = await workos.directorySync.listUsers({
        directory: directoryId,
        limit: 100,
    })
    res.render('users.ejs', { users: users.data })
})

app.get('/groups', async (req, res) => {
    let directoryId: string | undefined
    if (typeof req.query.id === 'string') {
        directoryId = req.query.id
    }

    const groups: List<Group> = await workos.directorySync.listGroups({
        directory: directoryId,
        limit: 100,
    })
    res.render('groups.ejs', { groups: groups.data })
})

app.post('/webhooks', async (req: Request, res: Response) => {
    const webhook: Webhook = workos.webhooks.constructEvent({
        payload: req.body,
        sigHeader:
            typeof req.headers['workos-signature'] === 'string'
                ? req.headers['workos-signature']
                : '',
        secret:
            process.env.WORKOS_WEBHOOK_SECRET !== undefined
                ? process.env.WORKOS_WEBHOOK_SECRET
                : '',
        tolerance: 90000,
    })

    io.emit('webhook event', { webhook })

    res.sendStatus(200)
})

app.get('/webhooks', async (req: Request, res: Response) => {
    res.render('webhooks.ejs', {
        title: 'Webhooks',
    })
})
