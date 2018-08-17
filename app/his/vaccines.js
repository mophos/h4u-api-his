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
const his_jhcis_model_1 = require("./../models/his_jhcis.model");
const his_hosxpv3_model_1 = require("./../models/his_hosxpv3.model");
const his_hi_model_1 = require("./../models/his_hi.model");
const his_jhos_model_1 = require("./../models/his_jhos.model");
const hisJhcisModel = new his_jhcis_model_1.HisJhcisModel();
const hisHosxpv3Model = new his_hosxpv3_model_1.HisHosxpv3Model();
const hisHiModel = new his_hi_model_1.HisHiModel();
const hisJhosModel = new his_jhos_model_1.HisJhosModel();
const moment = require("moment");
class Vaccines {
    his_jhcis(db, hn, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield hisJhcisModel.getVaccine(db, hn);
            console.log(rs);
            const vaccines = [];
            rs.forEach(v => {
                const obj = {
                    "date_serve": moment(v.date_serve).format('YYYY-MM-DD'),
                    "time_serve": null,
                    "vaccine_code": v.vaccine_code,
                    "vaccine_name": v.vaccine_name
                };
                vaccines.push(obj);
            });
            const data = {
                "request_id": requestId,
                "vaccines": vaccines
            };
            return ({ ok: true, rows: data });
        });
    }
    his_jhos(db, hn, hcode) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    his_hosxpv3(db, hn, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield hisHosxpv3Model.getEpi(db, hn);
            const vaccines = [];
            rs.forEach(v => {
                const objEpi = {
                    "date_serve": moment(v.date_serve).format('YYYY-MM-DD'),
                    "time_serve": v.time_serve,
                    "vaccine_code": v.vaccine_code,
                    "vaccine_name": v.vaccine_name
                };
                vaccines.push(objEpi);
            });
            const data = {
                "request_id": requestId,
                "vaccines": vaccines
            };
            return ({ ok: true, rows: data });
        });
    }
    his_hi(db, hn, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vaccine = yield hisHiModel.getEpiAll(db, hn);
            const vaccines = [];
            for (let item of vaccine[0]) {
                let objvaccines = {};
                objvaccines.date_serve = moment(item.date_serve).format("YYYY-MM-DD");
                let time;
                if (item.time_serve.toString().length === 3) {
                    time = '0' + item.time_serve;
                }
                else {
                    time = item.time_serve.toString();
                }
                objvaccines.time_serve = moment(time, "HH:mm:ss").format("HH:mm:ss");
                objvaccines.vaccine_code = item.vaccine_code;
                objvaccines.vaccine_name = item.vaccine_name;
                vaccines.push(objvaccines);
            }
            const data = {
                "request_id": requestId,
                "vaccines": vaccines
            };
            return ({ ok: true, rows: data });
        });
    }
}
exports.Vaccines = Vaccines;
//# sourceMappingURL=vaccines.js.map