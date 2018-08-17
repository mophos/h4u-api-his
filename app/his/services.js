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
class Services {
    his_jhcis(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {};
            let profile = {};
            if (hn) {
                try {
                    let rs_hosp = yield hisJhcisModel.getHospital(db, hn);
                    let rs_name = yield hisJhcisModel.getProfile(db, hn);
                    let rs_bloodgroup = yield hisJhcisModel.getBloodgroup(db, hn);
                    let rs_allergy = yield hisJhcisModel.getAllergyDetail(db, hn);
                    let rs_disease = yield hisJhcisModel.getDisease(db, hn);
                    let rs_services = yield hisJhcisModel.getServices(db, hn, dateServe);
                    const disease = [];
                    const allergy = [];
                    const services = [];
                    for (const v of rs_disease) {
                        let obj = {
                            icd10_code: v.icd10_code,
                            icd10_desc: v.icd10_desc
                        };
                        disease.push(obj);
                    }
                    for (const v of rs_allergy) {
                        let obj = {
                            drug_name: v.drug_name,
                            symptom_desc: v.symptom_desc
                        };
                        allergy.push(obj);
                    }
                    console.log(rs_services);
                    const profile = {
                        name: {
                            title_name: rs_name[0].title_name,
                            first_name: rs_name[0].first_name,
                            last_name: rs_name[0].last_name,
                        },
                        blood_group: rs_bloodgroup[0].blood_group,
                        disease: disease,
                        allergy: allergy
                    };
                    console.log(rs_services);
                    for (const v of rs_services) {
                        let activities = {};
                        const pe = [{ pe: v.pe }];
                        const diagnosis = [];
                        const drugs = [];
                        const lab = [];
                        const anc = [];
                        const vaccine = [];
                        console.log('visitno', v.visitno);
                        const rs_serviceDetail = yield hisJhcisModel.getServiceDetail(db, v.visitno);
                        for (const vs of rs_serviceDetail) {
                            const objDiagnosis = {
                                icd10_code: vs.icd10_code,
                                icd10_desc: vs.icd10_desc,
                                diag_type: vs.diag_type
                            };
                            diagnosis.push(objDiagnosis);
                        }
                        const rs_drugs = yield hisJhcisModel.getDrugs(db, v.visitno);
                        for (const rd of rs_drugs) {
                            const objDrug = {
                                "drug_name": rd.drug_name,
                                "qty": rd.qty,
                                "unit": rd.unit,
                                "usage_line1": rd.usage_line1,
                                "usage_line2": rd.usage_line2,
                                "usage_line3": rd.usage_line3
                            };
                            drugs.push(objDrug);
                        }
                        let objRefer = {};
                        if (v.hcode_to != null) {
                            objRefer = {
                                "hcode_to": v.hcode_to,
                                "reason": v.reason
                            };
                        }
                        const rs_app = yield hisJhcisModel.getAppointment(db, v.visitno);
                        let objAppointment = {};
                        if (rs_app.length) {
                            objAppointment = {
                                "date": rs_app[0].date,
                                "time": rs_app[0].time,
                                "department": "",
                                "detail": rs_app[0].detail
                            };
                        }
                        const rs_lab = yield hisJhcisModel.getLab(db, hn, v.visitno);
                        for (const rl of rs_lab) {
                            const obj = {
                                "lab_name": rl.lab_name,
                                "lab_result": rl.lab_result,
                                "standard_result": rl.standard_result
                            };
                            lab.push(obj);
                        }
                        const rs_anc = yield hisJhcisModel.getAnc(db, v.visitno);
                        for (const ran of rs_anc) {
                            const obj = {
                                "ga": ran.ga,
                                "anc_no": ran.anc_no,
                                "result": ran.result
                            };
                            lab.push(obj);
                        }
                        const rs_vacc = yield hisJhcisModel.getVaccineService(db, v.visitno);
                        for (const rv of rs_vacc) {
                            const obj = {
                                "vaccine_code": rv.vaccine_code,
                                "vaccine_name": rv.vaccine_name
                            };
                            vaccine.push(obj);
                        }
                        const pp = {
                            anc: anc,
                            vaccine: vaccine
                        };
                        activities = {
                            pe: pe,
                            diagnosis: diagnosis,
                            drugs: drugs,
                            refer: objRefer,
                            appointment: objAppointment,
                            lab: lab,
                            pp: pp
                        };
                        const obj = {
                            date_serve: v.date_serve,
                            time_serve: v.time_serve,
                            clinic: rs_hosp[0].hname,
                            seq: v.seq,
                            screening: {
                                weight: v.weight,
                                height: v.height,
                                dbp: v.dbp,
                                sbp: v.sbp,
                                bmi: v.bmi
                            },
                            activities: activities
                        };
                        services.push(obj);
                    }
                    data = {
                        hcode: rs_hosp[0].hcode,
                        hname: rs_hosp[0].hname,
                        hn: hn,
                        cid: rs_name[0].cid,
                        uid: uid,
                        request_id: requestId,
                        profile: profile,
                        services: services
                    };
                    return ({ ok: true, rows: data });
                }
                catch (error) {
                    console.log(error);
                    return ({ ok: false, error: error });
                }
            }
        });
    }
    his_jhos(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    his_hosxp(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {};
            let profile = {};
            if (hn) {
                try {
                    let rs_name = yield hisHosxpv3Model.getPtDetail(db, hn);
                    let rs_bloodgrp = yield hisHosxpv3Model.getBloodgrp(db, hn);
                    let rs_allergy = yield hisHosxpv3Model.getAllergyDetail(db, hn);
                    let rs_disease = yield hisHosxpv3Model.getDisease(db, hn);
                    let rs_hosp = yield hisHosxpv3Model.getHospital(db);
                    let rs_services = yield hisHosxpv3Model.getServices(db, hn, dateServe);
                    let rs = yield hisHosxpv3Model.getServices(db, dateServe, hn);
                    let obj_name = {};
                    let obj_hospital = [];
                    let obj_allergy = [];
                    let obj_disease = [];
                    let objProfile = {};
                    let objService = {};
                    let vaccines = [];
                    let services = {};
                    let activities = {};
                    let pp = [];
                    let anc = {};
                    let allergy = [];
                    let chronic = [];
                    let hcode = rs_hosp[0].hcode;
                    let hname = rs_hosp[0].hname;
                    const rs_vaccine = yield hisHosxpv3Model.getEpi(db, hn);
                    for (const rv of rs_vaccine) {
                        const objVcc = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": hcode,
                            "provider_name": hname,
                            "date_serv": moment(rv.date_serve).format('YYYY-MM-DD'),
                            "time_serv": rv.time_serve,
                            "vaccine_code": rv.vaccine_code,
                            "vaccine_name": rv.vaccine_name
                        };
                        vaccines.push(objVcc);
                        objService.vaccines = vaccines;
                    }
                    for (const rc of rs_disease) {
                        const objCho = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": hcode,
                            "provider_name": hname,
                            "date_serv": moment(rc.date_serve).format('YYYY-MM-DD'),
                            "time_serv": rc.time_serve,
                            "icd_code": rc.icd10_code,
                            "icd_name": rc.icd_name,
                            "start_date": moment(rc.start_date).format('YYYY-MM-DD')
                        };
                        chronic.push(objCho);
                        objService.chronic = chronic;
                    }
                    for (const ra of rs_allergy) {
                        const objAllergy = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": hcode,
                            "provider_name": hname,
                            "drug_name": ra.drug_name,
                            "symptom": ra.symptom
                        };
                        allergy.push(objAllergy);
                        objService.allergy = allergy;
                    }
                    for (const v of rs_services) {
                        const pe = [];
                        const diagnosis = [];
                        const drugs = [];
                        const lab = [];
                        const anc = [];
                        const procedure = [];
                        let appointment = [];
                        let refer = [];
                        let screening = {};
                        const rs_screening = yield hisHosxpv3Model.getScreening(db, v.vn);
                        const rs_diagnosis = yield hisHosxpv3Model.getDiagnosis(db, v.vn);
                        for (const rg of rs_diagnosis) {
                            const objDiagnosis = {
                                request_id: requestId,
                                uid: uid,
                                provider_code: hcode,
                                provider_name: hname,
                                seq: rg.vn,
                                date_serv: moment(rg.date_serve).format('YYYY-MM-DD'),
                                time_serv: rg.time_serv,
                                icd_code: rg.icd10_code,
                                icd_name: rg.icd10_desc,
                                diag_type: rg.diag_type,
                            };
                            diagnosis.push(objDiagnosis);
                            objService.diagnosis = diagnosis;
                        }
                        const rs_procedure = yield hisHosxpv3Model.getProcedure(db, v.vn);
                        for (const rp of rs_procedure[0]) {
                            const objProcedure = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
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
                            objService.procedure = procedure;
                        }
                        const rs_drugs = yield hisHosxpv3Model.getDrugs(db, v.vn);
                        for (const rd of rs_drugs) {
                            const objDrug = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
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
                            objService.drugs = drugs;
                        }
                        const rs_lab = yield hisHosxpv3Model.getLabs(db, v.vn);
                        for (const rl of rs_lab) {
                            const objLab = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": rl.vn,
                                "date_serv": moment(rl.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rl.time_serv,
                                "lab_name": rl.lab_name,
                                "lab_result": rl.lab_result,
                                "standard_result": rl.standard_result
                            };
                            lab.push(objLab);
                            objService.lab = lab;
                        }
                        const rs_app = yield hisHosxpv3Model.getAppointment(db, v.vn);
                        if (rs_app.length) {
                            appointment = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
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
                        const rs_refer = yield hisHosxpv3Model.getRefer(db, v.vn);
                        if (rs_refer.length) {
                            refer = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
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
                        services = objService;
                    }
                    if (rs_name.length) {
                        return ({
                            ok: true,
                            rows: services
                        });
                    }
                    else {
                        return ({ ok: false });
                    }
                }
                catch (error) {
                    return ({ ok: false, error: error.message });
                }
            }
            else {
                return ({ ok: false, error: 'Incorrect data!' });
            }
        });
    }
    his_homc(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hn) {
                try {
                    let objProfile = {};
                    let objService = {};
                }
                catch (error) {
                    return ({ ok: false, error: error.message });
                }
            }
            else {
                return ({ ok: false, error: 'Incorrect data!' });
            }
        });
    }
    his_mbase(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hn) {
                try {
                    let objProfile = {};
                    let objService = {};
                }
                catch (error) {
                    return ({ ok: false, error: error.message });
                }
            }
            else {
                return ({ ok: false, error: 'Incorrect data!' });
            }
        });
    }
    his_hi(db, hn, dateServe, uid, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hn) {
                try {
                    let rs_name = yield hisHiModel.getPtDetail(db, hn);
                    let rs_bloodgrp = yield hisHiModel.getBloodgrp(db, hn);
                    let rs_chronic = yield hisHiModel.getDisease(db, hn);
                    let rs_hosp = yield hisHiModel.getHospital(db);
                    let obj_name = {};
                    let obj_hospital = [];
                    let obj_chronic = [];
                    let objProfile = {};
                    obj_name.title_name = rs_name[0].title_name;
                    obj_name.first_name = rs_name[0].first_name;
                    obj_name.last_name = rs_name[0].last_name;
                    let cid = rs_name[0].cid;
                    let hcode = rs_hosp[0].hcode;
                    let hname = rs_hosp[0].hname;
                    obj_chronic.chronic = rs_chronic;
                    objProfile.name = obj_name;
                    objProfile.blood_group = rs_bloodgrp[0].blood_group;
                    objProfile.chronic = rs_chronic;
                    let rs = yield hisHiModel.getSeq(db, dateServe, hn);
                    let services = {};
                    let anc = {};
                    for (let item of rs[0]) {
                        let objService = {};
                        let time;
                        if (item.time.toString().length === 3) {
                            time = '0' + item.time;
                        }
                        else {
                            time = item.time.toString();
                        }
                        let rs_diagnosis = yield hisHiModel.getDiagnosis(db, item.seq);
                        let diagnosis = [];
                        for (const dia of rs_diagnosis) {
                            const objdiag = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": item.seq,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "icd10_code": dia.icd10_code,
                                "icd10_desc": dia.icd10_desc,
                                "diage_type": dia.diage_type
                            };
                            diagnosis.push(objdiag);
                            objService.diagnosis = diagnosis;
                        }
                        let rs_drugs = yield hisHiModel.getDrugs(db, item.seq);
                        let drugs = [];
                        for (const rd of rs_drugs[0]) {
                            const objdrug = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": item.seq,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "drug_name": rd.drug_name,
                                "qty": rd.qty,
                                "unit": rd.unit,
                                "usage_line1": rd.usage_line1,
                                "usage_line2": rd.usage_line2,
                                "usage_line3": rd.usage_line3
                            };
                            drugs.push(objdrug);
                            objService.drugs = drugs;
                        }
                        let rs_refer = yield hisHiModel.getRefer(db, item.seq);
                        let refer = [];
                        for (const re of rs_refer) {
                            const objRefer = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": item.seq,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "to_provider_code": re.hcode_to,
                                "to_provider_name": re.name_to,
                                "reason": re.reason,
                                "start_date": moment(item.date).format("YYYY-MM-DD")
                            };
                            refer.push(objRefer);
                            objService.refer = refer;
                        }
                        let rs_appointment = yield hisHiModel.getAppointment(db, item.seq);
                        let appointment = [];
                        for (const app of rs_appointment) {
                            const objapp = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": item.seq,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "clinic": app.department,
                                "appoint_date": app.date,
                                "appoint_time": app.time,
                                "detail": app.detail
                            };
                            appointment.push(objapp);
                            objService.appointment = appointment;
                        }
                        let rs_lab = yield hisHiModel.getLabs(db, item.seq);
                        let lab = [];
                        for (const rl of rs_lab[0]) {
                            const objlab = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "seq": item.seq,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "lab_name": rl.lab_name,
                                "lab_result": rl.lab_result,
                                "standard_result": rl.standard_result
                            };
                            lab.push(objlab);
                            objService.lab = lab;
                        }
                        let rs_vaccine = yield hisHiModel.getEpiAll(db, hn);
                        let vaccines = [];
                        for (const rv of rs_vaccine[0]) {
                            const objvaccine = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "date_serv": moment(item.date).format("YYYY-MM-DD"),
                                "time_serv": moment(time, "HH:mm:ss").format("HH:mm:ss"),
                                "vaccine_code": rv.vaccine_code,
                                "vaccine_name": rv.vaccine_name
                            };
                            vaccines.push(objvaccine);
                            objService.vaccines = vaccines;
                        }
                        let rs_allergy = yield hisHiModel.getAllergyDetail(db, hn);
                        let allergy = [];
                        for (const al of rs_allergy) {
                            const objallergy = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "drug_name": al.namedrug,
                                "symptom": al.detail
                            };
                            allergy.push(objallergy);
                            objService.allergy = allergy;
                        }
                        let rs_chronic = yield hisHiModel.getDisease(db, hn);
                        let chronic = [];
                        for (const ch of rs_chronic) {
                            const objchronic = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": hcode,
                                "provider_name": hname,
                                "icd_code": ch.icd10_code,
                                "icd_name": ch.icd10_desc,
                                "start_date": ch.start_date
                            };
                            chronic.push(objchronic);
                            objService.chronic = chronic;
                        }
                        services = objService;
                    }
                    if (rs_name.length) {
                        return ({
                            ok: true,
                            rows: {
                                services: services
                            }
                        });
                    }
                    else {
                        return ({ ok: false });
                    }
                }
                catch (error) {
                    return ({ ok: false, error: error.message });
                }
            }
            else {
                return ({ ok: false, error: 'Incorrect data!' });
            }
        });
    }
}
exports.Services = Services;
//# sourceMappingURL=services.js.map