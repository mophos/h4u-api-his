import { Services } from './../his/services';
import * as HttpStatus from 'http-status-codes';
// import * as express from 'express';
// import * as request from 'request';
// import * as moment from 'moment';
import { Router, Request, Response } from 'express';


const provider = process.env.HIS_PROVIDER;
const services = new Services();
const router: Router = Router();


router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH PHR API' });
});

router.get('/view/:hn/:dateServe/:request_id/:uid', async (req: Request, res: Response) => {
    let db = req.db;
    let hn: any = req.params.hn;
    let dateServe: any = req.params.dateServe;
    let uid: any = req.params.uid;
    let requestId: any = req.params.request_id;
    let rs: any;
    if (provider == 'jhcis') {
        rs = await services.his_jhcis(db, hn, dateServe, uid, requestId);
    } else if (provider == 'hosxpv3') {
        rs = await services.his_hosxp(db, hn, dateServe, uid, requestId);
    } else if (provider == 'hi') {
        rs = await services.his_hi(db, hn, dateServe, uid, requestId);
    } else if (provider == 'jhos') {
        rs = await services.his_jhos(db, hn, dateServe, uid, requestId);
    }
    res.send(rs);
});

export default router;