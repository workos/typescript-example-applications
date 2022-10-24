const express = require('express')
const session = require('express-session')
const openIt = require('open')
const { WorkOS } = require('@workos-inc/node')
const { user_signed_in, user_logged_out, user_organization_deleted, user_connection_deleted} = require('../audit_log_events')

const app = express()
const router = express.Router()

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)

const workos = new WorkOS(process.env.WORKOS_API_KEY)

router.get('/', function (req: any, res: any) {
    res.render('login.ejs')
})

router.post('/set_org', async (req: any, res: any) => {
    const org = await workos.organizations.getOrganization(
        req.body.org
    );

    session.orgId = org.id
    session.orgName = org.name

    res.render('send_events.ejs', {
        orgName: org.name,
        orgId: org.id
    })
})

router.post('/send_event', async (req: any, res:any) => {
    const eventId = req.body.eventId
    let event;

    switch(eventId) {
        case 'user_signed_in':
            event = user_signed_in
            break
        case 'user_logged_out':
            event = user_logged_out
            break
        case 'user_organization_deleted':
            event = user_organization_deleted
            break
        case 'user_connection_deleted':
            event = user_connection_deleted
            break
    }

    await workos.auditLogs.createEvent(
        session.orgId || 'org_01G2TKRPR28XB702EF71EA8BY6',
        event
    )
})

router.get('/export_events', (req: any, res: any) => {
    res.render('export_events.ejs', {
        orgName: session.orgName,
        orgId: session.orgId
    })
})

router.get('/generate_csv', async (req: any, res: any) => {
    const now = new Date()
    const monthAgo = now.setMonth(now.getMonth() - 1)

    const auditLogExport = await workos.auditLogs.createExport({
        organization_id: session.orgId,
        range_start: new Date(monthAgo).toISOString(),
        range_end: new Date().toISOString(),
    })

    session.exportId = auditLogExport.id
})

router.get('/access_csv', async (req: any, res: any) => {
    const auditLogExport = await workos.auditLogs.getExport(
        session.exportId,
    )   

    openIt(auditLogExport.url)
})

router.get('/logout', (req: any, res: any) => {
    session.orgId = null
    res.render('login.ejs')
})

module.exports = router;
