"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const app = (0, express_1.default)();
const node_1 = __importDefault(require("@workos-inc/node"));
const session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
const workos = new node_1.default(process.env.WORKOS_API_KEY);
let factors = session.factors = [];
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('index.ejs', {
        title: "Home",
        factors: factors,
    });
}));
router.get('/enroll_factor', (req, res) => {
    res.render('enroll_factor.ejs');
});
router.post('/enroll_new_factor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.type === "sms") {
        let phone_number = req.body.phone_number;
        const new_factor = yield workos.mfa.enrollFactor({
            type: 'sms',
            phoneNumber: phone_number,
        });
        factors.push(new_factor);
    }
    else {
        const new_factor = yield workos.mfa.enrollFactor({
            type: 'totp',
            issuer: req.body.totp_issuer,
            user: req.body.totp_user,
        });
        factors.push(new_factor);
    }
    res.redirect('/');
}));
router.get('/factor_detail/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const factor = yield factors.filter((factor) => {
        return factor.id == req.params.id;
    })[0];
    session.current_factor = factor;
    res.render('factor_detail.ejs', { title: 'Factor Detail', factor: factor });
}));
router.post('/challenge_factor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (session.current_factor.type === "sms") {
        let message = req.body.sms_message;
        session.sms_message = message;
        const challenge = yield workos.mfa.challengeFactor({
            authenticationFactorId: session.current_factor.id,
            smsTemplate: message,
        });
        session.challenge_id = challenge.id;
    }
    if (session.current_factor.type === "totp") {
        const challenge = yield workos.mfa.challengeFactor({
            authenticationFactorId: session.current_factor.id
        });
        session.challenge_id = challenge.id;
    }
    res.render('challenge_factor.ejs', { title: 'Challenge Factor' });
}));
router.post('/verify_factor', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buildCode = (codeItems) => {
        let code = [];
        for (const item in codeItems) {
            code.push(codeItems[item]);
        }
        return code.join("");
    };
    const code = buildCode(req.body);
    const challenge_id = session.challenge_id;
    const verify_factor = yield workos.mfa.verifyFactor({
        authenticationChallengeId: challenge_id,
        code: code,
    });
    res.render('challenge_success.ejs', { title: 'Challenge Success', verify_factor: verify_factor });
}));
router.get('/clear_session', (req, res) => {
    factors = [];
    res.redirect('/');
});
exports.default = router;
