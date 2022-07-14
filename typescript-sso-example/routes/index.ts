import express from "express";
const router = express.Router();
const app = express();
import WorkOS from '@workos-inc/node';
import session from 'express-session';

const workos = new WorkOS("");

// Use the Connection ID associated to your SSO Connection.
const connection = "";

// Set the redirect URI to whatever URL the end user should land on post-authentication.
// Ensure that the redirect URI you use is included in your allowlist inthe WorkOS Dashboard.
const redirectURI = "http://localhost:3000/callback";

// Store the Client ID, pulled from .env sourced from the Configuration section
// of the WorkOS Dashboard.
const clientID = ""

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: "Home"
    });
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
        res.redirect(url);
      } catch (error) {
        console.log(error)
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

    res.redirect('/');

  } catch (error) {
    console.log(error)
  }
});
  
  // Logout route
  router.get('/logout', async (req, res) => {
  });
  

export default router;