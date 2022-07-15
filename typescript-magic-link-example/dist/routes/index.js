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
const node_1 = __importDefault(require("@workos-inc/node"));
const workos = new node_1.default(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("index.ejs", {
        title: "Home",
    });
}));
router.post('/passwordless-auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const session = yield workos.passwordless.createSession({
        email,
        type: 'MagicLink'
    });
    yield workos.passwordless.sendSession(session.id);
    res.render("confirmation.ejs", {
        email: session.email,
        link: session.link,
    });
}));
router.get("/success", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    const profile = yield workos.sso.getProfileAndToken({
        code,
        clientID,
    });
    res.render("login_successful.ejs", {
        profile: JSON.stringify(profile, null, 4),
    });
}));
exports.default = router;
