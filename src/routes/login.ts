'use strict';
import { LoginModel } from './../models/login';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const loginModel = new LoginModel();
const jwtModel = new JwtModel();


router.post('/', async (req, res, next) => {
  const db = req.db;
  const username: any = req.body.username;
  const password: any = req.body.password;
  try {
    let rs: any = await loginModel.smartHealhtLogin(username, password);
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
        }
        let token = jwtModel.sign(payload);
        res.send({ ok: true, token: token });
      } else {
        res.send({ ok: false, error: `status: ${rs.status} - ${rs.message}` });
      }
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});
export default router;