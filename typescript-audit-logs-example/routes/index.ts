import express, { Application, Router } from 'express'
import { AuditLogExport, GeneratePortalLinkIntent, Organization, WorkOS } from '@workos-inc/node'
import { List } from '@workos-inc/node/lib/common/interfaces/list.interface'
import open from 'open'

const app: Application = express()
const router: Router = express.Router()
const session = require('express-session')

app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
)

const workos: WorkOS = new WorkOS(process.env.WORKOS_API_KEY)

router.get('/', async (req, res) => {
    let before: string | undefined = req.query.before ? req.query.before.toString() : undefined
    let after: string | undefined = req.query.after ? req.query.after.toString() : undefined

    const organizations: List<Organization> = await workos.organizations.listOrganizations({
        limit: 5,
        before: before,
        after: after,
        order: undefined
    })

    before = organizations.list_metadata.before
    after = organizations.list_metadata.after

    res.render('login.ejs', {
        organizations: organizations.data,
        before: before,
        after: after,
    })
})

router.get('/set_org', async (req, res) => {
    const organizationID: string = req.query.id ? req.query.id.toString() : ''

    const org: Organization = await workos.organizations.getOrganization(
        organizationID
    )

    session.orgId = org.id
    session.orgName = org.name

    const now: Date = new Date()
    const monthAgo: number = now.setMonth(now.getMonth() - 1)

    res.render('send_events.ejs', {
        orgName: org.name,
        orgId: org.id,
        rangeStart: new Date(monthAgo).toISOString(),
        rangeEnd: new Date().toISOString()
    })
})

router.post('/send_event', async (req, res) => {
    const { eventAction, eventVersion, actorName, actorType, targetName, targetType } = req.body

    const event = {
        'action': eventAction,
        'version': Number(eventVersion),
        'occurred_at': new Date(),
        'actor': {
            'type': actorType,
            'name': actorName,
            'id': 'user_12345678901234567890123456',
        },
        'targets': [
            {
                'type': targetType,
                'name': targetName,
                'id': 'team_12345678901234567890123456',
            },
        ],
        'context': {
            'location': '123.123.123.123',
            'user_agent': 'Chrome/104.0.0.0',
        },
    }

    try {
        await workos.auditLogs.createEvent(
            session.orgId,
            event
        )
    } catch (error) {
        console.error(error)
    }
})

router.post('/generate_csv', async (req, res) => {
    const { actions, actors, targets, rangeStart, rangeEnd } = req.body

    const exportDetails = {
        organization_id: session.orgId,
        range_start: rangeStart,
        range_end: rangeEnd,
        actions: undefined,
        actors: undefined,
        targets: undefined
    }

    actions && (exportDetails.actions = actions)
    actors && (exportDetails.actors = actors)
    targets && (exportDetails.targets = targets)

    try {
        const auditLogExport: AuditLogExport = await workos.auditLogs.createExport(exportDetails)
        session.exportId = auditLogExport.id
    } catch (error) {
        console.error(error)
    }
})

router.get('/access_csv', async (req, res) => {
    const auditLogExport: AuditLogExport = await workos.auditLogs.getExport(
        session.exportId,
    )

    if (auditLogExport.url) {
        await open(auditLogExport.url)
    }
})

router.get('/events', async (req, res) => {
    let intent: GeneratePortalLinkIntent = GeneratePortalLinkIntent.AuditLogs

    switch (req.query.intent) {
        case 'audit_logs':
            intent = GeneratePortalLinkIntent.AuditLogs
            break
        case 'log_streams':
            intent = GeneratePortalLinkIntent.LogStreams
            break
    }

    const { link }: { link: string } = await workos.portal.generateLink({
        organization: session.orgId,
        intent
    })

    res.redirect(link)
})

router.get('/logout', (req, res) => {
    session.orgId = null
    session.orgName = null
    session.exportId = null

    res.redirect('/')
})

export default router


