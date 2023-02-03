import express, { Application, Request, Response, Router } from 'express'
import { ProfileAndToken, WorkOS } from '@workos-inc/node'

const app: Application = express()
const router: Router = express.Router()
const session: any = require('express-session')

app.use(
  session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
  })
)

const workos: WorkOS = new WorkOS(process.env.WORKOS_API_KEY)
const clientID: string = process.env.WORKOS_CLIENT_ID !== undefined ? process.env.WORKOS_CLIENT_ID : ''
const organizationID: string  = 'org_01GRC2753QJJG6TWFF7R70TS0M'
const redirectURI: string = 'http://localhost:8000/callback'
const state: string = ''

router.get('/', (req: Request, res: Response) => {
  try {
    if (session.isloggedin) {
      res.render('login_successful.ejs', {
        profile: JSON.stringify(session.profile, null, 2),
        first_name: session.first_name
      })
    } else {
      return res.render('index.ejs')
    }
  } catch (error) {
    return res.render('error.ejs', { error: error })
  }
})

router.get('/login', (req: Request, res: Response) => {
  try {
    const url: string = workos.sso.getAuthorizationURL({
      organization: organizationID,
      clientID: clientID,
      redirectURI: redirectURI,
      state: state,
    })
    
    res.redirect(url)
  } catch (error) {
    res.render('error.ejs', { error: error })
  }
})

router.get('/callback', async (req: Request, res: Response) => {
  try {
    const code: string = typeof req.query.code === 'string' ? req.query.code : ''

    const profile: ProfileAndToken = await workos.sso.getProfileAndToken({
      code,
      clientID,
    })

    session.first_name = profile.profile.first_name
    session.profile = profile
    session.isloggedin = true

    res.redirect('/')
  } catch (error) {
    return res.render('error.ejs', { error: error })
  }
})

router.get('/logout', async (req: Request, res: Response) => {
  try {
    session.first_name = null
    session.profile = null
    session.isloggedin = null

    return res.redirect('/')
  } catch (error) {
    return res.render('error.ejs', { error: error })
  }
})

export default router