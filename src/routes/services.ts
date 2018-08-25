import { Router, Request, Response } from 'express';
import * as moment from 'moment';
// model
import { HisJhcisModel } from './../models/his_jhcis.model';
import { HisHosxpv3Model } from './../models/his_hosxpv3.model';
import { HisHosxpv4Model } from './../models/his_hosxpv4.model';
import { HisHiModel } from './../models/his_hi.model';
import { HisJhosModel } from './../models/his_jhos.model';
import { HisHomcModel } from './../models/his_homc.model';
import { HisBudhospModel } from './../models/his_budhosp.model';
import { HisHosxppcuModel } from './../models/his_hosxp_pcu.model';

const provider = process.env.HIS_PROVIDER;
const router: Router = Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'MOPH H4U API' });
});

// ห้ามแก้ไข // 
let hisModel: any;
switch (provider) {
    case 'ezhosp':
        // hisModel = new HisEzhospModel();
        break;
    case 'hosxpv3':
        hisModel = new HisHosxpv3Model();
        break;
    case 'hosxpv4':
        hisModel = new HisHosxpv4Model();
        break;
    case 'ssb':
        // hisModel = new HisSsbModel();
        break;
    case 'infod':
        // hisModel = new HisInfodModel();
        break;
    case 'hi':
        hisModel = new HisHiModel();
        break;
    case 'himpro':
        // hisModel = new HisHimproModel();
        break;
    case 'jhcis':
        hisModel = new HisJhcisModel();
        break;
    case 'hosxppcu':
        hisModel = new HisHosxppcuModel();
        break;
    case 'hospitalos':
        // hisModel = new HisHospitalOsModel();
        break;
    case 'jhos':
        hisModel = new HisJhosModel();
        break;
    case 'pmk':
        // hisModel = new HisPmkModel();
        break;
    case 'meedee':
        // hisModel = new HisMdModel();
        break;
    case 'spdc':
        // hisModel = new HisSpdcModel();
        break;
    case 'homc':
        hisModel = new HisHomcModel();
        break;
    case 'budhosp':
        hisModel = new HisBudhospModel();
        break;
    default:
    // hisModel = new HisModel();
}

// ห้ามแก้ไข // 
router.get('/view/:hn/:dateServe/:request_id/:uid', async (req: Request, res: Response) => {
    let db = req.db;
    let hn = req.params.hn;
    let dateServe = req.params.dateServe;
    let uid = req.params.uid;
    let requestId = req.params.request_id;
    let objService: any = {};
    let providerCode;
    let providerName;

    if (requestId && hn && dateServe && uid) {
        try {
            let rs_hospital: any = await hisModel.getHospital(db, hn);
            //console.log('Hospital : ', rs_hospital);
            if (rs_hospital.length) {
                providerCode = rs_hospital[0].provider_code;
                providerName = rs_hospital[0].provider_name;
            }

            const rs_vaccine: any = await hisModel.getVaccine(db, hn);
            if (rs_vaccine.length) {
                let vaccines: any = [];
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
                    }
                    vaccines.push(objVcc);
                }
                objService.vaccines = vaccines;
            }

            let rs_chronic: any = await hisModel.getChronic(db, hn);
            if (rs_chronic.length) {
                let chronic: any = [];
                for (const rc of rs_chronic) {
                    const objCho = {
                        "request_id": requestId,
                        "uid": uid,
                        "provider_code": providerCode,
                        "provider_name": providerName,
                        "time_serv": rc.time_serve,
                        "icd_code": rc.icd_code,
                        "icd_name": rc.icd_name,
                        "start_date": moment(rc.start_date).format('YYYY-MM-DD')
                    }
                    chronic.push(objCho);
                }
                objService.chronic = chronic;
            }

            let rs_allergy: any = await hisModel.getAllergyDetail(db, hn);
            if (rs_allergy.length) {
                let allergy: any = [];
                for (const ra of rs_allergy) {
                    const objAllergy = {
                        "request_id": requestId,
                        "uid": uid,
                        "provider_code": providerCode,
                        "provider_name": providerName,
                        "drug_name": ra.drug_name,
                        "symptom": ra.symptom
                    }
                    allergy.push(objAllergy);
                }
                objService.allergy = allergy;
            }

            let rs_services: any = await hisModel.getServices(db, hn, dateServe);
            // console.log('Service : ', rs_services);
            if (rs_services.length) {
                for (const v of rs_services) {
                    const diagnosis = [];
                    const drugs = [];
                    const lab = [];
                    const procedure = [];
                    let appointment: any = [];
                    let refer: any = [];

                    const rs_diagnosis = await hisModel.getDiagnosis(db, hn, v.seq);
                    if (rs_diagnosis.length) {
                        for (const rg of rs_diagnosis) {          
                            console.log(rg.icd_code);          
                            const objDiagnosis = {
                                request_id: requestId,
                                uid: uid,
                                provider_code: providerCode,
                                provider_name: providerName,
                                seq: rg.seq,
                                date_serv: moment(rg.date_serve).format('YYYY-MM-DD'),
                                time_serv: rg.time_serv,
                                icd_code: rg.icd_code,
                                icd_name: rg.icd_desc,
                                diag_type: rg.diag_type,
                            }
                            diagnosis.push(objDiagnosis);
                        }
                        objService.diagnosis = diagnosis;
                    }

                    const rs_procedure = await hisModel.getProcedure(db, v.seq)
                    if (rs_procedure.length) {
                        for (const rp of rs_procedure) {
                            const objProcedure = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rp.seq,
                                "date_serv": moment(rp.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rp.time_serve,
                                "procedure_code": rp.procedure_code,
                                "procedure_name": rp.procedure_name,
                                "start_date": moment(rp.start_date).format('YYYY-MM-DD'),
                                "start_time": rp.start_time,
                                "end_date": moment(rp.end_date).format('YYYY-MM-DD'),
                                "end_time": rp.end_time
                            }
                            procedure.push(objProcedure);
                        }
                        objService.procedure = procedure;
                    }


                    const rs_drugs = await hisModel.getDrugs(db, v.seq);
                    if (rs_drugs.length) {
                        for (const rd of rs_drugs) {
                            const objDrug = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rd.seq,
                                "date_serv": moment(rd.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rd.time_serv,
                                "drug_name": rd.drug_name,
                                "qty": rd.qty,
                                "unit": rd.unit,
                                "usage_line1": rd.usage_line1,
                                "usage_line2": rd.usage_line2,
                                "usage_line3": rd.usage_line3
                            }
                            drugs.push(objDrug);
                        }
                        objService.drugs = drugs;
                    }


                    const rs_lab = await hisModel.getLabs(db, v.seq);
                    if (rs_lab.length) {
                        for (const rl of rs_lab) {
                            const objLab = {
                                "request_id": requestId,
                                "uid": uid,
                                "provider_code": providerCode,
                                "provider_name": providerName,
                                "seq": rl.seq,
                                "date_serv": moment(rl.date_serve).format('YYYY-MM-DD'),
                                "time_serv": rl.time_serv,
                                "lab_name": rl.lab_name,
                                "lab_result": rl.lab_result,
                                "standard_result": rl.standard_result
                            }
                            lab.push(objLab);
                        }
                        objService.lab = lab;
                    }


                    const rs_app = await hisModel.getAppointment(db, v.seq);
                    if (rs_app.length) {
                        appointment = {
                            "request_id": requestId,
                            "uid": uid,
                            "provider_code": providerCode,
                            "provider_name": providerName,
                            "seq": rs_app[0].seq,
                            "date_serv": moment(rs_app[0].date_serve).format('YYYY-MM-DD'),
                            "time_serv": rs_app[0].time_serv,
                            "clinic": rs_app[0].department,
                            "appoint_date": moment(rs_app[0].date).format('YYYY-MM-DD'),
                            "appoint_time": rs_app[0].time,
                            "detail": rs_app[0].detail
                        }
                        objService.appointment = appointment;
                    }

                    const rs_refer = await hisModel.getRefer(db, v.seq);
                    if (rs_refer.length) {
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
                        }
                        objService.refer = refer;
                    }
                }
            }

            if (objService) {
                res.send({ ok: true, rows: objService });
            } else {
                res.send({ ok: false });
            }
        } catch (error) {
            res.send({ ok: false, error: error.message });
        }
    } else {
        res.send({ ok: false, error: 'Incorrect data!' });
    }
});

export default router;