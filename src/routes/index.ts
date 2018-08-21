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
import { HisHomecModel } from './../models/his_homec.model';
const router = express.Router();
const jwt = new JwtModel();
const provider = process.env.HIS_PROVIDER;

/* GET home page. */
router.get('/', (req, res, next) => {
  let hisModel: any;
  switch (provider) {
    case 'ezhosp':
      // hisModel = new HisEzhospModel();
      break;
    case 'hosxpv3':
      hisModel = new HisHosxpv3Model();
      break;
    case 'hosxpv4':
      hisModel = new HisHosxpv4Model();
      break;
    case 'ssb':
      // hisModel = new HisSsbModel();
      break;
    case 'infod':
      // hisModel = new HisInfodModel();
      break;
    case 'hi':
      hisModel = new HisHiModel();
      break;
    case 'himpro':
      // hisModel = new HisHimproModel();
      break;
    case 'jhcis':
      hisModel = new HisJhcisModel();
      break;
    case 'hosxppcu':
      // hisModel = new HisHosxppcuModel();
      break;
    case 'hospitalos':
      // hisModel = new HisHospitalOsModel();
      break;
    case 'jhos':
      hisModel = new HisJhosModel();
      break;
    case 'pmk':
      // hisModel = new HisPmkModel();
      break;
    case 'meedee':
      // hisModel = new HisMdModel();
      break;
    case 'spdc':
      // hisModel = new HisSpdcModel();
      break;
    case 'homec':
      hisModel = new HisHomecModel();
      break;
    default:
    // hisModel = new HisModel();
  }

  const dbName = process.env.DB_NAME;
  let today = moment().format('YYYY-MM-DD HH:mm:ss');
  let db = req.db;
  let hospCode: string = req.body.hospCode;
  hisModel.getTableName(db)
    .then((results: any) => {
      res.render('index', { title: 'MOPH PHR API' });
    })
    .catch(error => {
      console.log({ results: error });
      // res.send({ ok: false, date: today, his_provider: provider, error: 'Connection error' })
      res.render('index', { title: 'MOPH PHR API' });
    })
    .finally(() => {
      db.destroy();
    });
  if (res.header) return;
  res.render('index', { title: 'MOPH PHR API'});
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