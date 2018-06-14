'use strict';
var request = require("request");
import * as express from 'express';
import { JwtModel } from '../models/jwt'
const router = express.Router();
const jwt = new JwtModel();


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'MOPH PHR API' });
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