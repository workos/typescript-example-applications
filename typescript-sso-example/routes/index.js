"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const app = (0, express_1.default)();
const node_1 = __importDefault(require("@workos-inc/node"));
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    isloggedin: false,
}));
const workos = new node_1.default(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID !== undefined ? process.env.WORKOS_CLIENT_ID : "";
// Use the Connection ID associated to your SSO Connection.
const connection = "";
// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";
// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
router.get('/', (req, res) => {
    try {
        if (session.isloggedin) {
            res.render('login_successful.ejs', {
                profile: JSON.stringify(session.profile, null, 2),
                first_name: session.first_name
            });
        }
        else {
            return res.render('index.ejs', {
                title: "Home"
            });
        }
    }
    catch (error) {
        return res.render('error.ejs', { error: error });
    }
});
/* GET login page */
router.get('/login', (_req, res) => {
    try {
        const url = workos.sso.getAuthorizationURL({
            connection: connection,
            clientID: clientID,
            redirectURI: redirectURI,
        });
        // Redirect the user to the url generated above.
        return res.redirect(url);
    }
    catch (error) {
        return res.render('error.ejs', { error: error });
    }
});
/* GET callback page */
router.get('/callback', async (req, res) => {
    try {
        // Capture and save the `code` passed as a querystring in the Redirect URI.
        const code = req.query.code;
        const profile = await workos.sso.getProfileAndToken({
            code,
            clientID,
        });
        session.first_name = profile.profile.first_name;
        session.profile = profile;
        session.isloggedin = true;
        return res.redirect('/');
    }
    catch (error) {
        return res.render('error.ejs', { error: error });
    }
});
// Logout route
router.get('/logout', async (req, res) => {
    try {
        session.first_name = null;
        session.profile = null;
        session.isloggedin = null;
        return res.redirect('/');
    }
    catch (error) {
        return res.render('error.ejs', { error: error });
    }
});
exports.default = router;
