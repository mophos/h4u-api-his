'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("./../models/login");
const jwt_1 = require("./../models/jwt");
var request = require("request");
const express = require("express");
const router = express.Router();
const loginModel = new login_1.LoginModel();
const jwtModel = new jwt_1.JwtModel();
router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const db = req.db;
    const username = req.body.username;
    const password = req.body.password;
    try {
        let rs = yield loginModel.smartHealhtLogin(username, password);
        console.log(rs);
        if (rs) {
            if (rs.jwt_token) {
                let payload = {
                    fullname: `${rs.user.name} ${rs.user.last_name}`,
                    job_position: rs.user.job_position,
                    email: rs.user.email,
                    enabled: rs.user.enabled,
                    token: rs.jwt_token,
                    hospcode: rs.user.code
                };
                let token = jwtModel.sign(payload);
                res.send({ ok: true, token: token });
            }
            else {
                res.send({ ok: false, error: `status: ${rs.status} - ${rs.message}` });
            }
        }
        else {
            res.send({ ok: false, error: 'เกิดข้อผิดพลาด' });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
//# sourceMappingURL=login.js.map