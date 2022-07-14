import express from "express";
const router = express.Router();
const app = express();
import WorkOS from '@workos-inc/node';
const session = require('express-session');

app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    isloggedin: false,
  }));

const workos = new WorkOS("");

// Use the Connection ID associated to your SSO Connection.
const connection = "";

// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";

// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
const clientID = ""

router.get('/', (req, res) => {

    try {
        if (session.isloggedin){
            res.render('login_successful.ejs', {
            profile: JSON.stringify(session.profile), 
            first_name: session.first_name
            });
        }

        else {
            return res.render('index.ejs', {
                title: "Home"
            });
        }
    } catch (error) {
        return res.render('error.ejs', {error: error})
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
      } catch (error) {
        return res.render('error.ejs', {error: error})
      }
});

/* GET callback page */
router.get('/callback', async (req, res) => {
    try {
      // Capture and save the `code` passed as a querystring in the Redirect URI.
    const code = req.query.code as unknown as string;
  
    const profile = await workos.sso.getProfileAndToken({
        code,
        clientID,
    });


    session.first_name = profile.profile.first_name;
    session.profile = profile
    session.isloggedin = true;

    return res.redirect('/');

  } catch (error) {
    return res.render('error.ejs', {error: error})
  }
});
  
// Logout route
router.get('/logout', async (req, res) => {
    try {
      session.first_name = null;
      session.profile = null;
      session.isloggedin = null;
  
      return res.redirect('/');
    } catch (error) {
      return res.render('error.ejs', {error: error})
    }
  });
  
export default router;