'use strict';
import { MemberModel } from './../models/member';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const memberModel = new MemberModel();
const jwtModel = new JwtModel();


router.get('/officer', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const email = req.query.email;
  try {
    let rs: any = await memberModel.getOfficer(token, email);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/register', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const officer = req.body.officer;
  try {
    let rs: any = await memberModel.register(token, officer);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;