"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./../his/services");
const express_1 = require("express");
const provider = process.env.HIS_PROVIDER;
const services = new services_1.Services();
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH PHR API' });
});
router.get('/view/:hn/:dateServe/:request_id/:uid', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let db = req.db;
    let hn = req.params.hn;
    let dateServe = req.params.dateServe;
    let uid = req.params.uid;
    let requestId = req.params.request_id;
    let rs;
    if (provider == 'jhcis') {
        rs = yield services.his_jhcis(db, hn, dateServe, uid, requestId);
    }
    else if (provider == 'hosxpv3') {
        rs = yield services.his_hosxp(db, hn, dateServe, uid, requestId);
    }
    else if (provider == 'hi') {
        rs = yield services.his_hi(db, hn, dateServe, uid, requestId);
    }
    else if (provider == 'jhos') {
        rs = yield services.his_jhos(db, hn, dateServe, uid, requestId);
    }
    res.send(rs);
}));
exports.default = router;
//# sourceMappingURL=services.js.map