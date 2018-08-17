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
const vaccines_1 = require("./../his/vaccines");
const express_1 = require("express");
const provider = process.env.HIS_PROVIDER;
const vaccines = new vaccines_1.Vaccines();
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH PHR API' });
});
router.get('/view/:hn/:requestId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let db = req.db;
    let hn = req.params.hn;
    let requestId = req.params.requestId;
    let rs;
    if (provider == 'jhcis') {
        rs = yield vaccines.his_jhcis(db, hn, requestId);
    }
    else if (provider == 'hosxpv3') {
        rs = yield vaccines.his_hosxpv3(db, hn, requestId);
    }
    else if (provider == 'hi') {
        rs = yield vaccines.his_hi(db, hn, requestId);
    }
    else if (provider == 'jhos') {
        rs = yield vaccines.his_jhos(db, hn, requestId);
    }
    res.send(rs);
}));
exports.default = router;
//# sourceMappingURL=vaccines.js.map