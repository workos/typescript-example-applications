import express from "express";
const router = express.Router();
const app = express();
import WorkOS from '@workos-inc/node';
import { EnrollFactorOptions } from "@workos-inc/node/lib/mfa/interfaces/enroll-factor-options";
import { Factor } from "@workos-inc/node/lib/mfa/interfaces/factor.interface";
import { ChallengeFactorOptions } from "@workos-inc/node/lib/mfa/interfaces/challenge-factor-options";
import { Challenge } from "@workos-inc/node/lib/mfa/interfaces/challenge.interface";
import { VerifyFactorOptions } from "@workos-inc/node/lib/mfa/interfaces/verify-factor-options";
import { VerifyResponse } from "@workos-inc/node/lib/mfa/interfaces/verify-factor-response";
const session = require('express-session');


app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));

const workos = new WorkOS('sk_test_a2V5XzAxRlZONkUwRkRLMllYS1k0RVFaNlNQOUZKLFhPMktpd1ZpV1EyU1k0bUVVT291MFlZQ1E');

let factors: Factor[] = session.factors = [];

router.get('/', async (req, res) => {
    res.render('index.ejs', {
        title: "Home",
        factors: factors,
    });
});

router.get('/enroll_factor', (req, res) => {
    res.render('enroll_factor.ejs')
})

router.post('/enroll_new_factor', async (req, res) => {
    if (req.body.type === "sms") {
        let phone_number = req.body.phone_number;
        let options: EnrollFactorOptions = {
            type: 'sms',
            phoneNumber: phone_number,
        }
        const new_factor: Factor = await workos.mfa.enrollFactor(options);
        factors.push(new_factor);
    } else {
        let options: EnrollFactorOptions = {
            type: 'totp',
            issuer: req.body.totp_issuer,
            user: req.body.totp_user,
        }

        const new_factor: Factor = await workos.mfa.enrollFactor(options);
        factors.push(new_factor);
    }
    res.redirect('/')
});

router.get('/factor_detail/:id', async (req, res) => {
    const factor: Factor = await factors.filter((factor) => {
        return factor.id == req.params.id
    })[0]

    session.current_factor = factor;
    res.render('factor_detail.ejs', { title: 'Factor Detail', factor: factor });
});

router.post('/challenge_factor', async (req, res) => {
    if (session.current_factor.type === "sms") {
        let message: string = req.body.sms_message;
        session.sms_message = message;

        const options: ChallengeFactorOptions = {
            authenticationFactorId: session.current_factor.id,
            smsTemplate: message,
        }

        const challenge: Challenge = await workos.mfa.challengeFactor(options);
        session.challenge_id = challenge.id
    }

    if (session.current_factor.type === "totp") {

        const options: ChallengeFactorOptions = {
            authenticationFactorId: session.current_factor.id
        };

        const challenge = await workos.mfa.challengeFactor(options);
        session.challenge_id = challenge.id
    }

    res.render('challenge_factor.ejs', { title: 'Challenge Factor' });
});

router.post('/verify_factor', async (req, res) => {
    const buildCode = (codeItems: { [key: string]: string; }) => {
        let code: string[] = []
        for (const item in codeItems) {
            code.push(codeItems[item])
        }
        return code.join("");
    }
    const code: string = buildCode(req.body)
    const challenge_id: string = session.challenge_id;
    const options: VerifyFactorOptions = {
        authenticationChallengeId: challenge_id,
        code: code,
    }
    const verify_factor: VerifyResponse = await workos.mfa.verifyFactor(options);
    res.render('challenge_success.ejs', { title: 'Challenge Success', verify_factor: verify_factor });
});


router.get('/clear_session', (req, res) => {
    factors = [];
    res.redirect('/');
})

export default router;