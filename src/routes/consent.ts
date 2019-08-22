'use strict';
import { ConsentModel } from '../models/consent';
import { JwtModel } from '../models/jwt';

import * as express from 'express';
const router = express.Router();
const consentModel = new ConsentModel();
const jwtModel = new JwtModel();


router.get('/', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const query = req.query.query;
  try {
    const rs = await consentModel.getList(token, query);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.put('/tel', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.body.cid;
  const userId = req.body.userId;
  const tel = req.body.tel;

  try {
    const rs = await consentModel.updateTel(token, cid, userId, tel);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.post('/', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.body.cid;
  const fname = req.body.fname;
  const tel = req.body.tel;
  const lname = req.body.lname;
  const birthdate = req.body.birthdate;
  const imageBase64 = req.body.imageBase64;
  const parent = req.body.parent;

  try {
    const rs = await consentModel.save(token, cid, fname, lname, tel, birthdate, imageBase64, parent);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.post('/image', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.body.cid;
  const userId = req.body.userId;
  const imageBase64 = req.body.imageBase64;

  try {
    const rs = await consentModel.saveImage(token, cid, userId, imageBase64);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/image', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.query.cid;
  const id = req.query.id;
  try {
    const rs = await consentModel.getImage(token, id, cid);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/parent', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.query.cid;
  const id = req.query.id;
  try {
    const rs = await consentModel.getParent(token, id, cid);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.put('/parent', async (req, res, next) => {
  const token = req.decoded.gateway_token;
  const cid = req.body.cid;
  const id = req.body.id;
  const parent = req.body.parent;
  try {
    const rs = await consentModel.updateParent(token, id, cid, parent);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

router.get('/smarthealth', async (req, res, next) => {
  const token = req.decoded.smarthealth_token;
  const cid = req.query.cid;
  try {
    const rs: any = await consentModel.getSmarthealth(cid, token);
    if (rs.status == '204') {
      res.send({ ok: false })
    } else {
      res.send({ ok: true, rows: rs });
    }
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error });
  }
});

export default router;