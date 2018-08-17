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
const moment = require("moment");
const his_jhcis_model_1 = require("./../models/his_jhcis.model");
const his_hosxpv3_model_1 = require("./../models/his_hosxpv3.model");
const his_hosxpv4_model_1 = require("./../models/his_hosxpv4.model");
const his_hi_model_1 = require("./../models/his_hi.model");
const his_jhos_model_1 = require("./../models/his_jhos.model");
const his_homec_model_1 = require("./../models/his_homec.model");
const provider = process.env.HIS_PROVIDER;
const services = new services_1.Services();
const router = express_1.Router();
router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH H4U API' });
});
router.get('/view/:hn/:dateServe/:request_id/:uid', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let hisModel;
    switch (provider) {
        case 'ezhosp':
            break;
        case 'hosxpv3':
            hisModel = new his_hosxpv3_model_1.HisHosxpv3Model();
            break;
        case 'hosxpv4':
            hisModel = new his_hosxpv4_model_1.HisHosxpv4Model();
            break;
        case 'ssb':
            break;
        case 'infod':
            break;
        case 'hi':
            hisModel = new his_hi_model_1.HisHiModel();
            break;
        case 'himpro':
            break;
        case 'jhcis':
            hisModel = new his_jhcis_model_1.HisJhcisModel();
            break;
        case 'hosxppcu':
            break;
        case 'hospitalos':
            break;
        case 'jhos':
            hisModel = new his_jhos_model_1.HisJhosModel();
            break;
        case 'pmk':
            break;
        case 'meedee':
            break;
        case 'spdc':
            break;
        case 'homec':
            hisModel = new his_homec_model_1.HisHomecModel();
            break;
        default:
    }
    let db = req.db;
    let hn = req.params.hn;
    let dateServe = req.params.dateServe;
    let uid = req.params.uid;
    let requestId = req.params.request_id;
    let objService = {};
    let providerCode;
    let providerName;
    if (requestId && hn && dateServe && uid) {
        try {
            let rs_hospital = yield hisModel.getHospital(db);
            if (rs_hospital) {
                providerCode = rs_hospital[0].provider_code;
                providerName = rs_hospital[0].provider_name;
            }
            const rs_vaccine = yield hisModel.getVaccine(db, hn);
            if (rs_vaccine) {
                let vaccines = [];
                for (const rv of rs_vaccine) {
                    const objVcc = {
                        "request_id": requestId,
                        "uid": uid,
                        "provider_code": providerCode,
                        "provider_name": providerName,
                        "date_serv": moment(rv.date_serve).format('YYYY-MM-DD'),
                        "time_serv": rv.time_serve,
                        "vaccine_code": rv.vaccine_code,
                        "vaccine_name": rv.vaccine_name
                    };
                    vaccines.push(objVcc);
                }
                objService.vaccines = vaccines;
            }
            let rs_chronic = yield hisModel.getChronic(db, hn);
            if (rs_chronic) {
                let chronic = [];
                for (const rc of rs_chronic) {
                    const objCho = {
                        "request_id": requestId,
                        "uid": uid,
                        "provider_code": providerCode,
                        "provider_name": providerName,
                        "date_serv": moment(rc.date_serve).format('YYYY-MM-DD'),
                        "time_serv": rc.time_serve,
                        "icd_code": rc.icd10_code,
                        "icd_name": rc.icd_name,
                        "start_date": moment(rc.start_date).format('YYYY-MM-DD')
                    };
                    chronic.push(objCho);
                }
                objService.chronic = chronic;
            }
            let rs_allergy = yield hisModel.getAllergyDetail(db, hn);
            if (rs_allergy) {
                let allergy = [];
                for (const ra of rs_allergy) {
                    const objAllergy = {
                        "request_id": requestId,
                        "uid": uid,
                        "provider_code": providerCode,
                        "provider_name": providerName,
                        "drug_name": ra.drug_name,
                        "symptom": ra.symptom
                    };
                    allergy.push(objAllergy);
                }
                objService.allergy = allergy;
            }
            let rs_services = yield hisModel.getServices(db, hn, dateServe);
            if (rs_services) {
                for (const v of rs_services) {
                    const diagnosis = [];
                    const drugs = [];
                    const lab = [];
                    const procedure = [];
                    let appointment = [];
                    let refer = [];
                    const rs_diagnosis = yield hisModel.getDiagnosis(db, v.vn);
                    if (rs_diagnosis) {
                        for (const rg of rs_diagnosis) {
                            const objDiagnosis = {
                                request_id: requestId,
                                uid: uid,
                                provider_code: providerCode,
                                provider_name: providerName,
                                seq: rg.vn,
                                date_serv: moment(rg.date_serve).format('YYYY-MM-DD'),
                                time_serv: rg.time_serv,
                                icd_code: rg.icd10_code,
                                icd_name: rg.icd10_desc,
                                diag_type: rg.diag_type,
                            };
                            diagnosis.push(objDiagnosis);
                        }
                        objService.diagnosis = diagnosis;
                    }
                    const rs_procedure = yield hisModel.getProcedure(db, v.vn);
                    if (rs_procedure) {
                        for (const rp of rs_procedure) {
                            const objProcedure = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rp.vn,
                                "date_serv": moment(rp.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rp.start_time,
                                "procedure_code": rp.procedure_code,
                                "procedure_name": rp.procedure_name,
                                "start_date": moment(rp.start_date).format('YYYY-MM-DD'),
                                "start_time": rp.start_time,
                                "end_date": moment(rp.end_date).format('YYYY-MM-DD'),
                                "end_time": rp.end_time
                            };
                            procedure.push(objProcedure);
                        }
                        objService.procedure = procedure;
                    }
                    const rs_drugs = yield hisModel.getDrugs(db, v.vn);
                    if (rs_drugs) {
                        for (const rd of rs_drugs) {
                            const objDrug = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rd.vn,
                                "date_serv": moment(rd.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rd.time_serv,
                                "drug_name": rd.drug_name,
                                "qty": rd.qty,
                                "unit": rd.unit,
                                "usage_line1": rd.usage_line1,
                                "usage_line2": rd.usage_line2,
                                "usage_line3": rd.usage_line3
                            };
                            drugs.push(objDrug);
                        }
                        objService.drugs = drugs;
                    }
                    const rs_lab = yield hisModel.getLabs(db, v.vn);
                    if (rs_lab) {
                        for (const rl of rs_lab) {
                            const objLab = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rl.vn,
                                "date_serv": moment(rl.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rl.time_serv,
                                "lab_name": rl.lab_name,
                                "lab_result": rl.lab_result,
                                "standard_result": rl.standard_result
                            };
                            lab.push(objLab);
                        }
                        objService.lab = lab;
                    }
                    const rs_app = yield hisModel.getAppointment(db, v.vn);
                    if (rs_app) {
                        appointment = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "seq": rs_app[0].vn,
                            "date_serv": moment(rs_app[0].date_serve).format('YYYY-MM-DD'),
                            "time_serv": rs_app[0].time_serv,
                            "clinic": rs_app[0].department,
                            "appoint_date": moment(rs_app[0].date).format('YYYY-MM-DD'),
                            "appoint_time": rs_app[0].time,
                            "detail": rs_app[0].detail
                        };
                        objService.appointment = appointment;
                    }
                    const rs_refer = yield hisModel.getRefer(db, v.vn);
                    if (rs_refer) {
                        refer = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "seq": rs_refer[0].seq,
                            "date_serv": moment(rs_refer[0].date_serve).format('YYYY-MM-DD'),
                            "time_serv": rs_refer[0].time_serv,
                            "to_provider_code": rs_refer[0].depto_provider_codeartment,
                            "to_provider_name": rs_refer[0].to_provider_name,
                            "reason": rs_refer[0].refer_cause,
                            "start_date": moment(rs_refer[0].date_serv).format('YYYY-MM-DD')
                        };
                        objService.refer = refer;
                    }
                }
            }
            if (objService) {
                res.send({ ok: true, rows: services });
            }
            else {
                res.send({ ok: false });
            }
        }
        catch (error) {
            return ({ ok: false, error: error.message });
        }
    }
    else {
        res.send({ ok: false, error: 'Incorrect data!' });
    }
}));
exports.default = router;
//# sourceMappingURL=services.js.map