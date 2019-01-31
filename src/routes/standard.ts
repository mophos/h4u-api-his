'use strict';
import { StandardModel } from './../models/standard';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const standardModel = new StandardModel();
const jwtModel = new JwtModel();


router.get('/permission', async (req, res, next) => {
  const token = req.decoded.gateway_token;

  try {
    let rs: any = await standardModel.getPermission(token);
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