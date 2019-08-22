'use strict';
import { LoginModel } from './../models/login';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const loginModel = new LoginModel();
const jwtModel = new JwtModel();


router.post('/', async (req, res, next) => {
  // const db = req.db;
  const username: any = req.body.username;
  const password: any = req.body.password;
  try {
    let rs: any = await loginModel.h4uLogin(username, password);
    if (rs.ok) {
      if (rs.token) {
        let deToken = jwtModel.decode(rs.token);
        let payload: any = {};
        payload.gateway_token = rs.token;
        payload.smarthealth_token = deToken.smarthealth_token;
        payload.fullname = deToken.fullname
        payload.job_position = deToken.job_position;
        payload.email = deToken.email;
        payload.enabled = deToken.enabled;
        payload.hospcode = deToken.code;
        payload.provider_code = deToken.provider_code;
        payload.provider_name = deToken.provider_name;
        payload.status = deToken.status;
        payload.is_admin = deToken.is_admin;
        payload.is_staff = deToken.is_staff;
        payload.permissions = deToken.permissions;
        payload.is_member = deToken.status;
        let token = jwtModel.sign(payload);
        res.send({ ok: true, token: token });
      } else {
        res.send({ ok: false, error: `status: ${rs.status} - ${rs.message}` });
      }
    } else {
      res.send({ ok: false, error: rs.error });
    }
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error });
  }
});

export default router;