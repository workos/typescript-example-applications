import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Socket } from 'socket.io';
import { Directory, Group, User } from '@workos-inc/node';
const path = require("path");
const WorkOS = require('@workos-inc/node').default;
var cookieParser = require('cookie-parser');
var logger = require('morgan');
process.on('unhandledRejection', (reason, p) => { throw reason });
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const workos = new WorkOS(process.env.WORKOS_API_KEY);

const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

const io = require('socket.io')(server);


// app.engine('html', require('ejs').renderFile);
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.use('/public', express.static('public'));

io.on('connection', (socket: Socket) => {
    console.log('connected');

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});

app.get("/", async (req, res) => {
    const directories = await workos.directorySync.listDirectories();
    res.render("index", {
        title: "Home",
        directories: directories.data
    });
});


app.get('/directory/:id', async (req, res) => {
    const directories = await workos.directorySync.listDirectories();
    const directory = await directories.data.filter((directory: Directory) => {
        return directory.id == req.params.id
    })[0]
    res.render('directory.ejs', {
        directory: directory,
        title: "Directory"
    })
})

app.post('/webhooks', async (req, res) => {
    const webhook = workos.webhooks.constructEvent({
        payload: req.body,
        sigHeader: req.headers['workos-signature'],
        secret: process.env.WORKOS_WEBHOOK_SECRET,
        tolerance: 90000,
    })
    io.emit('webhook event', { webhook })

    return 200;
})

app.get('/webhooks', async (req, res) => {
    res.render('webhooks.ejs', {
        title: "Webhooks"
    });
});

app.get('/directory/:id/usersgroups', async (req, res) => {
    const directories = await workos.directorySync.listDirectories();
    const directory = await directories.data.filter((directory: Directory) => {
        return directory.id == req.params.id
    })[0]
    const groups = await workos.directorySync.listGroups({
        directory: req.params.id,
    });
    const users = await workos.directorySync.listUsers({
        directory: req.params.id,
    });

    res.render('groups.ejs', {
        groups: groups.data,
        directory: directory,
        users: users.data,
        title: "Group & Users"
    })
})

app.get('/directory/:id/group/:groupId', async (req, res) => {
    const directories = await workos.directorySync.listDirectories();
    const directory = await directories.data.filter((directory: Directory) => {
        return directory.id == req.params.id
    })[0]
    const groups = await workos.directorySync.listGroups({
        directory: req.params.id,
    });
    const group = await groups.data.filter((group: Group) => {
        return group.id == req.params.groupId
    })[0]
    res.render('group.ejs', {
        directory: directory,
        title: "Directory",
        group: JSON.stringify(group, null, 2),
        rawGroup: group
    })
})

app.get('/directory/:id/user/:userId', async (req, res) => {
    const directories = await workos.directorySync.listDirectories();
    const directory = await directories.data.filter((directory: Directory) => {
        return directory.id == req.params.id
    })[0]
    const users = await workos.directorySync.listUsers({
        directory: req.params.id,
    });
    const user = await users.data.filter((user: User) => {
        return user.id == req.params.userId
    })[0]
    res.render('user', {
        directory: directory,
        title: "Directory",
        user: JSON.stringify(user, null, 2),
        rawUser: user
    })
})
