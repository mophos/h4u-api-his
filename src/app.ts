'use strict';
require('dotenv').config();

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import index from './routes/index';
import loginRoutes from './routes/login';
import servicesRoute from './routes/services';
import * as ejs from 'ejs';
import { JwtModel } from './models/jwt';
import Knex = require('knex');
import * as cors from 'cors';

const app: express.Express = express();
const jwt = new JwtModel();

//view engine setup

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Check Token 
let checkAuth = (req, res, next) => {
  let token: string = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;
      next();
    }, err => {
      return res.send({
        ok: false,
        error: 'No token provided.',
        code: 403
      });
    });
}

let dbConnection: Knex.MySqlConnectionConfig = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

app.use((req, res, next) => {
  req.db = Knex({
    client: process.env.DB_CLIENT,
    connection: dbConnection,
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES ' + process.env.DB_CHARSET, (err) => {
          done(err, conn);
        });
      }
    },
    debug: false,
    acquireConnectionTimeout: 5000
  });

  next();
})
app.use(cors());
app.use('/', index);
app.use('/services', servicesRoute);
app.use('/login', loginRoutes);




//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  let errorMessage;
  switch (err['code']) {
    case 'ER_DUP_ENTRY':
      errorMessage = 'ข้อมูลซ้ำ';
      break;
    default:
      errorMessage = err;
      res.status(err['status'] || 500);
  }
  res.send({ ok: false, error: errorMessage });
});
export default app;
