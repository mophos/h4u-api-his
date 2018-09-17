'use strict';
import { RequestsModel } from './../models/requests';
import { JwtModel } from './../models/jwt';
var request = require("request");
import * as express from 'express';
const router = express.Router();
const requestsModel = new RequestsModel();
const jwtModel = new JwtModel();


router.get('/', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const status: any = req.query.status;
  console.log(token);

  try {
    let rs: any = await requestsModel.getRequests(token, status);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/nodata', async (req, res, next) => {
  const token = req.decoded.gateway_token
  const requestId = req.body.requestId;

  try {
    let rs: any = await requestsModel.sendNoData(token, requestId);
    if (rs.ok) {
      res.send({ ok: true })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/cancel', async (req, res, next) => {
  const token = req.decoded.gateway_token
  const requestId = req.body.requestId;
  try {
    let rs: any = await requestsModel.sendCancel(token, requestId);
    if (rs.ok) {
      res.send({ ok: true })
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดพลาด' })
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;