import { HisJhcisModel } from './../models/his_jhcis.model';
import { HisHosxpv3Model } from './../models/his_hosxpv3.model';
import { HisHiModel } from './../models/his_hi.model';
import { HisJhosModel } from './../models/his_jhos.model';
const hisJhcisModel = new HisJhcisModel();
const hisHosxpv3Model = new HisHosxpv3Model();
const hisHiModel = new HisHiModel();
const hisJhosModel = new HisJhosModel();
import * as moment from 'moment';

export class Services {
  async his_jhcis(db, hn, dateServe, uid, requestId) {
    let data = {};
    let profile: any = {};
    if (hn) {
      try {
        let rs_hosp: any = await hisJhcisModel.getHospital(db, hn);
        let rs_name: any = await hisJhcisModel.getProfile(db, hn);
        let rs_bloodgroup: any = await hisJhcisModel.getBloodgroup(db, hn);
        let rs_allergy: any = await hisJhcisModel.getAllergyDetail(db, hn);
        let rs_disease: any = await hisJhcisModel.getDisease(db, hn);
        let rs_services: any = await hisJhcisModel.getServices(db, hn, dateServe);
        const disease = [];
        const allergy = [];
        const services = [];

        for (const v of rs_disease) {
          let obj = {
            icd10_code: v.icd10_code,
            icd10_desc: v.icd10_desc
          }
          disease.push(obj);
        }
        for (const v of rs_allergy) {
          let obj = {
            drug_name: v.drug_name,
            symptom_desc: v.symptom_desc
          }
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
        }
        console.log(rs_services);

        for (const v of rs_services) {
          let activities = {};
          const pe = [{ pe: v.pe }]
          const diagnosis = [];
          const drugs = [];
          const lab = [];
          const anc = [];
          const vaccine = [];
          console.log('visitno', v.visitno);

          const rs_serviceDetail = await hisJhcisModel.getServiceDetail(db, v.visitno);
          for (const vs of rs_serviceDetail) {
            const objDiagnosis = {
              icd10_code: vs.icd10_code,
              icd10_desc: vs.icd10_desc,
              diag_type: vs.diag_type
            }
            diagnosis.push(objDiagnosis);
          }
          const rs_drugs = await hisJhcisModel.getDrugs(db, v.visitno);
          for (const rd of rs_drugs) {
            const objDrug = {
              "drug_name": rd.drug_name,
              "qty": rd.qty,
              "unit": rd.unit,
              "usage_line1": rd.usage_line1,
              "usage_line2": rd.usage_line2,
              "usage_line3": rd.usage_line3
            }
            drugs.push(objDrug);
          }

          let objRefer = {};
          if (v.hcode_to != null) {
            objRefer = {
              "hcode_to": v.hcode_to,
              "reason": v.reason
            }
          }

          const rs_app = await hisJhcisModel.getAppointment(db, v.visitno);
          let objAppointment = {}
          if (rs_app.length) {
            objAppointment = {
              "date": rs_app[0].date,
              "time": rs_app[0].time,
              "department": "",
              "detail": rs_app[0].detail
            }
          }

          const rs_lab = await hisJhcisModel.getLab(db, hn, v.visitno);
          for (const rl of rs_lab) {
            const obj = {
              "lab_name": rl.lab_name,
              "lab_result": rl.lab_result,
              "standard_result": rl.standard_result
            }
            lab.push(obj);
          }

          const rs_anc = await hisJhcisModel.getAnc(db, v.visitno);
          for (const ran of rs_anc) {
            const obj = {
              "ga": ran.ga,
              "anc_no": ran.anc_no,
              "result": ran.result
            }
            lab.push(obj);
          }

          const rs_vacc = await hisJhcisModel.getVaccineService(db, v.visitno);
          for (const rv of rs_vacc) {
            const obj = {
              "vaccine_code": rv.vaccine_code,
              "vaccine_name": rv.vaccine_name
            }
            vaccine.push(obj);
          }

          const pp = {
            anc: anc,
            vaccine: vaccine
          }

          activities = {
            pe: pe,
            diagnosis: diagnosis,
            drugs: drugs,
            refer: objRefer,
            appointment: objAppointment,
            lab: lab,
            pp: pp
          }
          // activities.push(objActivities);


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
          }
          services.push(obj);
          // });
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
        }

        return ({ ok: true, rows: data });


      } catch (error) {
        console.log(error);
        return ({ ok: false, error: error });
      }
    }
  }

  async his_jhos(db, hn, dateServe, uid, requestId) {
  }

  async his_hosxp(db, hn, dateServe, uid, requestId) {
    let data = {};
    let profile: any = {};
    if (hn) {
      try {
        let rs_name: any = await hisHosxpv3Model.getPtDetail(db, hn);
        let rs_bloodgrp: any = await hisHosxpv3Model.getBloodgrp(db, hn);
        let rs_allergy: any = await hisHosxpv3Model.getAllergyDetail(db, hn);
        let rs_disease: any = await hisHosxpv3Model.getDisease(db, hn);
        let rs_hosp: any = await hisHosxpv3Model.getHospital(db);
        let rs_services: any = await hisHosxpv3Model.getServices(db, hn, dateServe);
        let rs: any = await hisHosxpv3Model.getServices(db, dateServe, hn);
        let obj_name: any = {};
        let obj_hospital: any = [];
        let obj_allergy: any = [];
        let obj_disease: any = [];
        let objProfile: any = {};
        let vaccines: any = []; 

        const rs_vaccine: any = await hisHosxpv3Model.getEpi(db, hn);
        console.log('Vaccine : ', rs_vaccine);

        for (const rv of rs_vaccine) {
          const objVcc = {
            "provider_code": rv.provider_code,
            "provider_name": rv.provider_name,
            "date_serve": moment(rv.date_serve).format('YYYY-MM-DD'),
            "time_serve": rv.time_serve,
            "vaccine_code": rv.vaccine_code,
            "vaccine_name": rv.vaccine_name
          }
          vaccines.push(objVcc);
        }
 
        obj_name.title_name = rs_name[0].title_name;
        obj_name.first_name = rs_name[0].first_name;
        obj_name.last_name = rs_name[0].last_name;
        let hcode = rs_hosp[0].hcode;
        let hname = rs_hosp[0].hname;
        let cid = rs_name[0].cid;

        //obj_allergy.allergy = rs_allergy;
        //obj_disease.disease = rs_disease;
        objProfile.name = obj_name;
        objProfile.blood_group = rs_bloodgrp[0].blood_group;
        objProfile.allergy = rs_allergy;
        objProfile.chronic = rs_disease;
        objProfile.vaccines = vaccines;

        let services: any = [];
        let activities: any = {};
        let pp: any = [];
        let anc: any = {};

        for (const v of rs_services) {
          // const activities = {};
          const pe = [];
          const diagnosis = [];
          const drugs = [];
          const lab = [];
          const anc = [];
          //const vaccine = [];
          const procedure = [];
          let appointment: any = {};
          let refer: any = {};
          let screening = {};
          // console.log('vn : ', v.vn);

          // screening
          const rs_screening = await hisHosxpv3Model.getScreening(db, v.vn);

          const rs_diagnosis = await hisHosxpv3Model.getDiagnosis(db, v.vn);
          for (const rg of rs_diagnosis) {
            const objDiagnosis = {
              provider_code: rg.provider_code,
              provider_name: rg.provider_name,
              seq: rg.vn,
              date_serv: rg.date_serv,
              time_serv: rg.time_serv,
              icd10_code: rg.icd10_code,
              icd10_name: rg.icd10_desc,
              diag_type: rg.diag_type,
            }
            diagnosis.push(objDiagnosis);
          }

          const rs_procedure = await hisHosxpv3Model.getProcedure(db, v.vn)
          for (const rp of rs_procedure[0]) {
            const objProcedure = {
              "provider_code": rp.provider_code,
              "provider_name": rp.provider_name,
              "seq": rp.vn,
              "date_serv": rp.start_date,
              "time_serv": rp.start_time,
              "procedure_code": rp.procedure_code,
              "procedure_name": rp.procedure_name,
              "start_date": rp.start_date,
              "start_time": rp.start_time,
              "end_date": rp.end_date,
              "end_time": rp.end_time
            }
            procedure.push(objProcedure);
          }

          const rs_drugs = await hisHosxpv3Model.getDrugs(db, v.vn);
          for (const rd of rs_drugs) {
            const objDrug = {
              "provider_code": rd.provider_code,
              "provider_name": rd.provider_name,
              "seq": rd.vn,
              "date_serv": rd.date_serv,
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

          const rs_lab = await hisHosxpv3Model.getLabs(db, v.vn);
          for (const rl of rs_lab) {
            const objLab = {
              "provider_code": rl.provider_code,
              "provider_name": rl.provider_name,
              "seq": rl.vn,
              "date_serv": rl.date_serv,
              "time_serv": rl.time_serv,
              "lab_name": rl.lab_name,
              "lab_result": rl.lab_result,
              "standard_result": rl.standard_result
            }
            lab.push(objLab);
          }

          const rs_app = await hisHosxpv3Model.getAppointment(db, v.vn);
          if (rs_app.length) {
            appointment = {
              "provider_code": rs_app[0].provider_code,
              "provider_name": rs_app[0].provider_name,
              "seq": rs_app[0].vn,
              "date_serv": rs_app[0].date_serv,
              "time_serv": rs_app[0].time_serv,
              "clinic": rs_app[0].department,
              "appoint_date": rs_app[0].date,
              "appoint_time": rs_app[0].time,
              "detail": rs_app[0].detail
            }
          }

          const rs_refer = await hisHosxpv3Model.getRefer(db, v.vn);
          if (rs_refer.length) {
            refer = {
              "provider_code": rs_refer[0].provider_code,
              "provider_name": rs_refer[0].provider_name,
              "seq": rs_refer[0].seq,
              "date_serv": rs_refer[0].date_serv,
              "time_serv": rs_refer[0].time_serv,
              "to_provider_code": rs_refer[0].depto_provider_codeartment,
              "to_provider_name": rs_refer[0].to_provider_name,
              "reason": rs_refer[0].refer_cause,
              "start_date": rs_refer[0].date_serv
            }
          }
          // refer.to_provider_code = rs_refer[0].to_provider_code;
          // refer.reason = rs_refer[0].reason
          const rs_pe = await hisHosxpv3Model.getPe(db, v.vn);
          // const rs_anc = await hisHosxpv3Model.getAnc(db, v.vn, hn);
          // const rs_vaccine = await hisHosxpv3Model.getVaccine(db, v.vn);

          // console.log('ANC : ', rs_anc);

          const pp = {
            anc: anc,
            //vaccine: vaccine
          }

          activities = {
            pe: rs_pe,
            diagnosis: diagnosis,
            drugs: drugs,
            lab: lab,
            pp: pp,
            appointment: appointment,
            refer: refer,
            procedure: procedure,
          }

          // activities.push(objActivities);

          const obj = {
            date_serve: v.date_serve,
            time_serve: v.time_serve,
            clinic: rs_hosp[0].hname,
            seq: v.seq,
            screening: rs_screening[0],
            activities: activities
          }
          services.push(obj);

        }

        if (rs_name.length) {
          return ({
            ok: true,
            rows: {
              hcode: hcode,
              hname: hname,
              hn: hn,
              uid: uid,
              cid: cid,
              requestId: requestId,
              profile: objProfile,
              services: services
            }
          });
        }
        else {
          return ({ ok: false });
        }
      } catch (error) {
        return ({ ok: false, error: error.message });
      }
    } else {
      return ({ ok: false, error: 'Incorrect data!' });
    }
  }

  async his_hi(db, hn, dateServe, uid, requestId) {
    if (hn) {
      try {
        let rs_name: any = await hisHiModel.getPtDetail(db, hn);
        let rs_bloodgrp: any = await hisHiModel.getBloodgrp(db, hn);
        let rs_allergy: any = await hisHiModel.getAllergyDetail(db, hn);
        let rs_disease: any = await hisHiModel.getDisease(db, hn);
        let rs_hosp: any = await hisHiModel.getHospital(db);

        let obj_name: any = {};
        let obj_hospital: any = [];
        let obj_allergy: any = [];
        let obj_disease: any = [];
        let objProfile: any = {};

        obj_name.title_name = rs_name[0].title_name;
        obj_name.first_name = rs_name[0].first_name;
        obj_name.last_name = rs_name[0].last_name;
        let cid = rs_name[0].cid;

        let hcode = rs_hosp[0].hcode;
        let hname = rs_hosp[0].hname;

        obj_allergy.allergy = rs_allergy;
        obj_disease.disease = rs_disease;

        objProfile.name = obj_name;
        objProfile.blood_group = rs_bloodgrp[0].blood_group;
        //objProfile.allergy = obj_allergy;
        objProfile.allergy = rs_allergy;
        objProfile.disease = rs_disease;


        let rs: any = await hisHiModel.getSeq(db, dateServe, hn);
        // console.log(rs[0]);

        // let screening: any = {};

        let services: any = [];
        let activities: any = {};
        let pp: any = [];
        // obj_screening.screening = rs_screening;
        let anc: any = {};

        for (let item of rs[0]) {

          let objService: any = {};
          // let objActivities: any = {};
          let objPp: any = {};
          objService.date_serve = moment(item.date).format("YYYY-MM-DD");
          // console.log(item.time.toString().length);

          let time: string;
          if (item.time.toString().length === 3) {
            time = '0' + item.time;

          } else {
            time = item.time.toString();
          }

          objService.time_serve = moment(time, "HH:mm:ss").format("HH:mm:ss");// moment(item.time).locale('th').format('HH:mm');

          objService.clinic = item.department;
          objService.seq = item.seq;
          // screening
          let screening: any = await hisHiModel.getScreening(db, item.seq);
          objService.screening = screening[0];

          // activities
          activities.pe = await hisHiModel.getPe(db, item.seq);
          activities.diagnosis = await hisHiModel.getDiagnosis(db, item.seq);
          let drugs: any[] = await hisHiModel.getDrugs(db, item.seq);
          activities.drugs = drugs[0];
          let refer: any = await hisHiModel.getRefer(db, item.seq);
          activities.refer = refer[0];
          //activities.refer = await activitiesModell.getRefer(db, item.seq);

          let appointment: any[] = await hisHiModel.getAppointment(db, item.seq);
          activities.appointment = appointment[0];
          let lab: any[] = await hisHiModel.getLabs(db, item.seq);
          activities.lab = lab[0];

          // pp
          anc = await hisHiModel.getAnc(db, item.seq);
          objPp.anc = anc[0][0];

          let vaccine: any[] = await hisHiModel.getVaccine(db, item.seq);
          objPp.vaccine = vaccine[0];

          pp.push(objPp); // add objPp to pp
          activities.pp = pp[0] // add pp to objActivities

          objService.activities = activities;

          services.push(objService);

        }

        if (rs_name.length) {
          return ({
            ok: true,
            rows: {
              hcode: hcode,
              hname: hname,
              hn: hn,
              cid: cid,
              uid: uid,
              requestId: requestId,
              profile: objProfile,
              services: services
            }
          });
        }
        else {
          return ({ ok: false });
        }
      } catch (error) {
        return ({ ok: false, error: error.message });
      }
    } else {
      return ({ ok: false, error: 'Incorrect data!' });
    }
  }

}