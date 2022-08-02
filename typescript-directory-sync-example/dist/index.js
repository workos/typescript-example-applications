"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const node_1 = require("@workos-inc/node");
const morgan_1 = __importDefault(require("morgan"));
process.on('unhandledRejection', (reason, p) => { throw reason; });
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || '8000';
const workos = new node_1.WorkOS(process.env.WORKOS_API_KEY);
app.use('/public', express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
const server = app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('connected');
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directories = yield workos.directorySync.listDirectories();
    res.render("index", {
        title: "Home",
        directories: directories.data
    });
}));
app.get('/directory/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directories = yield workos.directorySync.listDirectories();
    const directory = yield directories.data.filter((directory) => {
        return directory.id == req.params.id;
    })[0];
    res.render('directory.ejs', {
        directory: directory,
        title: "Directory"
    });
}));
// const clientID: string = process.env.WORKOS_CLIENT_ID !== undefined ? process.env.WORKOS_CLIENT_ID : ""
app.post('/webhooks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const webhook = workos.webhooks.constructEvent({
        payload: req.body,
        sigHeader: req.headers['workos-signature'] !== undefined ? req.headers['workos-signature'] : "",
        secret: process.env.WORKOS_WEBHOOK_SECRET,
        tolerance: 90000,
    });
    io.emit('webhook event', { webhook });
    res.sendStatus(200);
}));
app.get('/webhooks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('webhooks.ejs', {
        title: "Webhooks"
    });
}));
app.get('/directory/:id/usersgroups', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directories = yield workos.directorySync.listDirectories();
    const directory = yield directories.data.filter((directory) => {
        return directory.id == req.params.id;
    })[0];
    const groups = yield workos.directorySync.listGroups({
        directory: req.params.id,
    });
    const users = yield workos.directorySync.listUsers({
        directory: req.params.id,
    });
    res.render('groups.ejs', {
        groups: groups.data,
        directory: directory,
        users: users.data,
        title: "Group & Users"
    });
}));
app.get('/directory/:id/group/:groupId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directories = yield workos.directorySync.listDirectories();
    const directory = yield directories.data.filter((directory) => {
        return directory.id == req.params.id;
    })[0];
    const groups = yield workos.directorySync.listGroups({
        directory: req.params.id,
    });
    const group = yield groups.data.filter((group) => {
        return group.id == req.params.groupId;
    })[0];
    res.render('group.ejs', {
        directory: directory,
        title: "Directory",
        group: JSON.stringify(group, null, 2),
        rawGroup: group
    });
}));
app.get('/directory/:id/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const directories = yield workos.directorySync.listDirectories();
    const directory = yield directories.data.filter((directory) => {
        return directory.id == req.params.id;
    })[0];
    const users = yield workos.directorySync.listUsers({
        directory: req.params.id,
    });
    const user = yield users.data.filter((user) => {
        return user.id == req.params.userId;
    })[0];
    res.render('user', {
        directory: directory,
        title: "Directory",
        user: JSON.stringify(user, null, 2),
        rawUser: user
    });
}));
