'use strict';
var request = require("request");
import * as express from 'express';
import * as moment from 'moment';
import { JwtModel } from '../models/jwt'
// model
import { HisJhcisModel } from './../models/his_jhcis.model';
import { HisHosxpv3Model } from './../models/his_hosxpv3.model';
import { HisHosxpv4Model } from './../models/his_hosxpv4.model';
import { HisHiModel } from './../models/his_hi.model';
import { HisJhosModel } from './../models/his_jhos.model';
import { HisHomcModel } from './../models/his_homc.model';
const router = express.Router();
const jwt = new JwtModel();
const provider = process.env.HIS_PROVIDER;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send({ ok: true, rows: 'MOPH H4U API HIS' })
});

router.post('/users/smh-login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var User: any = {};
  var options = {
    method: 'POST',
    url: 'http://203.157.102.103/api/phr/v1/hospital/login',
    headers:
    {
      'postman-token': 'd14f0145-ac90-a7bb-714b-29787e27d84d',
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    },
    body: { username: username, password: password },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    //console.log(body.user);
    if (body.user) {
      var playload = {
        fullname: body.user.name + " " + body.user.last_name
      }
      //var playload = body.user;
      var token = jwt.sign(playload);
      var User = body.user;
      res.send({ token: token });
    } else {
      res.send(body);
    }

  });
});

export default router;