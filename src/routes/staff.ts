'use strict';
import { StaffModel } from './../models/staff';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const staffModel = new StaffModel();
const jwtModel = new JwtModel();


router.get('/officers', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const status: any = req.query.status;
  const query: any = req.query.query;

  try {
    let rs: any = await staffModel.getOfficers(token, query, status);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

router.put('/officers', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const officer: any = req.body.officer;

  try {
    let rs: any = await staffModel.updateOfficers(token, officer);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/officers/permission', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const email: any = req.query.email;

  try {
    let rs: any = await staffModel.getOfficerPermission(token, email);
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