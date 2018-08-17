'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const index_1 = require("./routes/index");
const login_1 = require("./routes/login");
const services_1 = require("./routes/services");
const ejs = require("ejs");
const jwt_1 = require("./models/jwt");
const Knex = require("knex");
const cors = require("cors");
const app = express();
const jwt = new jwt_1.JwtModel();
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
let checkAuth = (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.query && req.query.token) {
        token = req.query.token;
    }
    else {
        token = req.body.token;
    }
    jwt.verify(token)
        .then((decoded) => {
        req.decoded = decoded;
        next();
    }, err => {
        return res.send({
            ok: false,
            error: 'No token provided.',
            code: 403
        });
    });
};
let dbConnection = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
app.use((req, res, next) => {
    req.db = Knex({
        client: 'mysql',
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
});
app.use(cors());
app.use('/', index_1.default);
app.use('/services', services_1.default);
app.use('/login', login_1.default);
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            title: 'error',
            message: err.message,
            error: err
        });
    });
}
app.use((err, req, res, next) => {
    res.status(err['status'] || 500);
    res.render('error', {
        title: 'error',
        message: err.message,
        error: {}
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map