import express, { Application, Request, Response, Router } from 'express'
import { WorkOS } from '@workos-inc/node'
const session = require('express-session')

const app: Application = express()
const router: Router = express.Router()

const workos: WorkOS = new WorkOS(process.env.WORKOS_API_KEY)
const clientID: string = process.env.WORKOS_CLIENT_ID !== undefined ? process.env.WORKOS_CLIENT_ID : ''
const connection: string  = 'org_01G8Y7Q0K3X5VYNE9TJKATDHYS'
const redirectURI: string = 'http://localhost:8000/callback'
const state: string = 'thisguysemail@gmail.com'

router.get('/', (req: Request, res: Response) => {
  try {
    if (session.isloggedin) {
      res.render('login_successful.ejs', {
        profile: JSON.stringify(session.profile, null, 2),
        first_name: session.first_name
      })
    } else {
      return res.render('index.ejs', {
        title: 'Home'
      })
    }
  } catch (error) {
    return res.render('error.ejs', { error: error })
  }
})

router.get('/login', (req: Request, res: Response) => {
  try {
    const url = workos.sso.getAuthorizationURL({
      connection: connection,
      clientID: clientID,
      redirectURI: redirectURI,
    })

    return res.redirect(url)
  } catch (error) {
    return res.render('error.ejs', { error: error })
  }
})

router.get('/callback', async (req, res) => {
  try {
    console.log('HERE IT IS', req.query.code)
    const code = typeof req.query.code === 'string' ? req.query.code : ''

    const profile = await workos.sso.getProfileAndToken({
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