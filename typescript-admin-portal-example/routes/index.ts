import express, { Request, Response, Router } from 'express'
import WorkOS, { GeneratePortalLinkIntent } from '@workos-inc/node'
import { Organization } from '@workos-inc/node/lib/organizations/interfaces/organization.interface'
import { List } from '@workos-inc/node/lib/common/interfaces/list.interface'

const workos: WorkOS = new WorkOS(process.env.WORKOS_API_KEY)

const router: Router = express.Router()

let organization: Organization

router.get('/', (req: Request, res: Response) => {
  res.render('index.ejs', {
    title: 'Home',
  })
})

router.post('/provision-enterprise', async (req: Request, res: Response) => {
  const organizationName: string = req.body.org ? req.body.org : ''
  const domains: string[] = req.body.domain ? req.body.domain.split(' ') : []
  const organizations: List<Organization> = await workos.organizations.listOrganizations({
    domains: domains,
  })

  if (organizations.data.length === 0) {
    organization = await workos.organizations.createOrganization({
      name: organizationName,
      domains: domains,
    })

    res.render('logged_in.ejs')
  } else {
    organization = organizations.data[0]

    res.render('logged_in.ejs')
  }
})

router.get('/sso-admin-portal', async (req: Request, res: Response) => {
  const organizationID: string = organization.id

  try {
    const { link }: { link: string } = await workos.portal.generateLink({
      organization: organizationID,
      intent: GeneratePortalLinkIntent.SSO,
    })

    res.redirect(link)
  } catch (error) {
    console.log(error)
  }
})

router.get('/dsync-admin-portal', async (_req: Request, res: Response) => {
  const organizationID: string = organization.id

  try {
    const { link }: { link: string } = await workos.portal.generateLink({
      organization: organizationID,
      intent: GeneratePortalLinkIntent.DSync,
    })

    res.redirect(link)
  }
  catch (error) {
    console.log(error)
  }
})


export default router
