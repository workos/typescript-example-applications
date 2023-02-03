import express, { Request, Response, Router }from 'express'
import WorkOS, { GeneratePortalLinkIntent } from '@workos-inc/node'
import { Organization } from "@workos-inc/node/lib/organizations/interfaces/organization.interface"
import 'dotenv/config'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

var organization: Organization

const router: Router = express.Router()

router.get('/', (req, res) => {
  res.render("index.ejs", {
    title: "Home",
  })
})

router.post('/provision-enterprise', async (req, res) => {
  const organizationName = req.body.org
  const domains = req.body.domain.split(" ")

  // Make call to listOrganizations and filter using the domain passed in by user.
  const organizations = await workos.organizations.listOrganizations({
    domains: domains,
  })
  // If no organizations exist with that domain, create one.
  if (organizations.data.length === 0) {
    organization = await workos.organizations.createOrganization({
      name: organizationName,
      domains: domains,
    })
    res.render('logged_in.ejs')
  }
  // If an organization does exist with the domain, use that organization for the connection.
  else {
    organization = organizations.data[0]
    res.render('logged_in.ejs')
  }
})

router.get('/sso-admin-portal', async (_req, res) => {
  const organizationID = organization.id

  try {
    // Generate an SSO Adnim Portal Link using the Organization ID from above.
    const { link } = await workos.portal.generateLink({
      organization: organizationID,
      intent: GeneratePortalLinkIntent.SSO,
    })

    res.redirect(link)
  } catch (error) {
    console.log(error)
  }
})

router.get('/dsync-admin-portal', async (_req, res) => {
  const organizationID = organization.id

  try {
    // Generate an SSO Adnim Portal Link using the Organization ID from above.
    const { link } = await workos.portal.generateLink({
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
