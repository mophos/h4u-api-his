import { Vaccines } from './../his/vaccines';
import { Router, Request, Response } from 'express';

const provider = process.env.HIS_PROVIDER;
const vaccines = new Vaccines();
const router: Router = Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH PHR API' });
});

router.get('/view/:hn/:requestId', async (req: Request, res: Response) => {
    let db = req.db;
    let hn: any = req.params.hn;
    let requestId: any = req.params.requestId;
    let rs: any;
    if (provider == 'jhcis') {
        rs = await vaccines.his_jhcis(db, hn, requestId);
    } else if (provider == 'hosxpv3') {
        rs = await vaccines.his_hosxpv3(db, hn, requestId);
    } else if (provider == 'hi') {
        rs = await vaccines.his_hi(db, hn, requestId);
    } else if (provider == 'jhos') {
        rs = await vaccines.his_jhos(db, hn, requestId);
    }
    res.send(rs);
});
export default router;