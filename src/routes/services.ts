import { His } from './../services/his';
import * as HttpStatus from 'http-status-codes';
// import * as express from 'express';
// import * as request from 'request';
// import * as moment from 'moment';
import { Router, Request, Response } from 'express';


const provider = process.env.HIS_PROVIDER;
const his = new His();
const router: Router = Router();


router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH PHR API' });
});

router.get('/view/:hn/:dateServe/:request_id/:register_id', async (req: Request, res: Response) => {
    let db = req.db;
    let hn: any = req.params.hn;
    let dateServe: any = req.params.dateServe;
    let registerId: any = req.params.register_id;
    let requestId: any = req.params.request_id;
    let rs: any;
    if (provider == 'jhcis') {
        rs = await his.his_jhcis(db, hn, dateServe, registerId, requestId);
    } else if (provider == 'hosxpv3') {
        rs = await his.his_hosxp(db, hn, dateServe, registerId, requestId);
    } else if (provider == 'hi') {
        rs = await his.his_hi(db, hn, dateServe, registerId, requestId);
    } else if (provider == 'jhos') {
        rs = await his.his_jhos(db, hn, dateServe, registerId, requestId);
    }
    console.log(rs);

    res.send(rs);
});

// router.get('/office', async (req: Request, res: Response) => {
//     let db = req.db;

//     try {
//         let rs: any = await his.getHospital(db);
//         if (rs.length) {
//             res.send({ ok: true, info: rs, code: HttpStatus.OK });
//         } else {
//             res.send({ ok: true, info: {}, code: HttpStatus.OK });
//         }
//     } catch (error) {
//         res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
//     }
// });

// router.post('/botline', function (req, res, next) {
//     var token = req.body.token;
//     var message = req.body.message;
//     console.log(token);
//     console.log(message);

//     request({
//         method: 'POST',
//         uri: 'https://notify-api.line.me/api/notify',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         auth: {
//             'bearer': token
//         },
//         form: {
//             message: message
//         }
//     }, (err, httpResponse, body) => {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json({
//                 httpResponse: httpResponse,
//                 body: body
//             });
//         }
//     });
// });

export default router;