'use strict';
var request = require("request");
import * as express from 'express';
import { JwtModel } from '../models/jwt'
// model
const router = express.Router();
const jwt = new JwtModel();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send({ ok: true, rows: 'MOPH H4U API HIS' })
});

export default router;