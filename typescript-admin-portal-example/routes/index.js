"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const node_1 = __importStar(require("@workos-inc/node"));
require("dotenv/config");
const workos = new node_1.default(process.env.WORKOS_API_KEY);
var organization;
router.get('/', (req, res) => {
    res.render("index.ejs", {
        title: "Home",
    });
});
router.post('/provision-enterprise', async (req, res) => {
    const organizationName = req.body.org;
    const domains = req.body.domain.split(" ");
    // Make call to listOrganizations and filter using the domain passed in by user.
    const organizations = await workos.organizations.listOrganizations({
        domains: domains,
    });
    // If no organizations exist with that domain, create one.
    if (organizations.data.length === 0) {
        organization = await workos.organizations.createOrganization({
            name: organizationName,
            domains: domains,
        });
        res.render('logged_in.ejs');
    }
    // If an organization does exist with the domain, use that organization for the connection.
    else {
        organization = organizations.data[0];
        res.render('logged_in.ejs');
    }
});
router.get('/sso-admin-portal', async (_req, res) => {
    const organizationID = organization.id;
    try {
        // Generate an SSO Adnim Portal Link using the Organization ID from above.
        const { link } = await workos.portal.generateLink({
            organization: organizationID,
            intent: node_1.GeneratePortalLinkIntent.SSO,
        });
        res.redirect(link);
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/dsync-admin-portal', async (_req, res) => {
    const organizationID = organization.id;
    try {
        // Generate an SSO Adnim Portal Link using the Organization ID from above.
        const { link } = await workos.portal.generateLink({
            organization: organizationID,
            intent: node_1.GeneratePortalLinkIntent.DSync,
        });
        res.redirect(link);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = router;
