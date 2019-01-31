import Knex = require('knex');
import * as moment from 'moment';
// ตัวอย่าง query แบบ knex
// getHospital(db: Knex,hn:any) {
//   return db('opdconfig as o')
//     .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
// }
// ตัวอย่างการคิวรี่โดยใช้ raw MySqlConnectionConfig
// async getHospital(db: Knex,hn:any) {
//   let data = await knex.raw(`select * from opdconfig`);
// return data[0];
// }

export class HospitalosModel {
  async getHospital(db: Knex, providerCode: any, hn: any) {
    let sql = await db.raw(`select site_full_name as provider_name,b_visit_office_id as provider_code from b_site`);
    return sql[0];
  }

  async getProfile(db: Knex, hn: any) {
    // let sql =`select persion_pid as cid,person_firstname as first_name,person_lastname as last_name from t_person where hn=${hn}`;
    let sql = await db.raw(`select tp.patient_hn as hn,tp.patient_pid as cid,fp.patient_prefix_description as title_name,tp.patient_firstname as first_name.
    tp.patient_lastname as last_name from t_patient tp 
    join f_patient_prefix fp on tp.f_patient_prefix = fp.f_patient_prefix where tp.patient_hn=${hn}`);
    return sql[0];
  }


  async getServices(db: Knex, hn: any, dateServ: any) {
    const _dateServ = (moment(dateServ).format('YYYY-') + 543) + moment(dateServ).format('MM_DD');
    let sql = await db.raw(`SELECT tv.visit_vn as seq,SubString(tv.visit_bigin_visit_time From 1 For 10) as date_serv,SubString(tv.visit_bigin_visit_time From 12 For 8) as time_serv
    from t_visit tv
    join t_patient tp on tv.t_patient_id = tp.t_patient_id
    WHERE tp.patient_hn = ? and SubString(tv.visit_bigin_visit_time From 1 For 10) = ? and t_visit_status_id <> 4
    `, [hn, _dateServ]);
    return sql[0];
  }

  async getAllergyDetail(db: Knex, hn: any) {
    let sql = await db.raw(`select bs.item_drug_standard_description as drug_name,ta.drug_allergy_symtom as symptom from t_patient_drug_allergy ta
    join b_item_drug_standard bs on bs.b_item_drug_standard_id = ta.b_item_drug_standard_id
    join t_patient tp on ta.t_patient_id = tp.t_patient_id
    where tp.patient_hn = ?)`, hn);
    return sql[0];
    // แพ้ยา
    // return [{drug_name:'',symptom:''}]
  }

  async getChronic(db: Knex, hn: any) {
    let sql = await db.raw(`select tc.chronic_icd10 as icd_code,b.icd10_description as icd_name,
    tc.chronic_diagnosis_date as start_date
    from t_chronic as tc 
    join b_icd10  as b on tc.chronic_icd10 = b.icd10_number
    where tc.chronic_active ='1' and tc.chronic_hn =?`, hn);
    return sql[0];
    // โรคเรื้อรัง
    // return [{icd_code:'',icd_name:'',start_date:''}]
  }


  async getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    let sql = await db.raw(`select tv.visit_vn as seq,td.diag_icd10_number as icd_code,bi.icd10_description as icd_name,td.f_diag_icd10_type_id from t_visit as tv
    join t_diag_icd10 as td on tv.t_visit_id = td=t_visit_id
    join b_icd10 as bi on bi.diag_icd10_number = td.icd10_number
    where tv.visit_vn = ?`, seq);
    return sql[0];
    // return [{icd_code:'',icd_name:'',diage_type:''}]
  }

  async getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    let sql = await db.raw(`
      select tv.visit_vn as seq,
      SubString(tvr.record_date_time from 1 for 10) as date_serv,
      SubString(tvr.record_date_time from 12 for 8) as time_serv,
      tvr.visit_refer_in_out_refer_hospital as to_provider_code,
      b.visit_office as to_provider_name,
      tvr.visit_refer_in_out_cause,
      SubString(tvr.record_date_time from 1 for 10) as start_date,
      from t_visit_refer_in_out tvr 
      join b_visit_office as b on tvr.visit_refer_in_out_refer_hospital = b.b_visit_office_id
      join t_visit tv on tv.t_visit_id = tvr.t_visit_id
      where tv.f_visit_refer_type_id ='0' and tv.visit_vn = ?`, seq);
    return sql[0];
    // SELECT ro.vn as seq,ov.vstdate as date_serv,ov.vsttime as time_serv,
    // ro.refer_hospcode as to_provider_code,h.name as to_provider_name,rf.name as reason,ro.refer_date as start_date
    // return [{hcode_to:'',name_to:'',reason:''}]
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(`SELECT 
    t_visit.visit_vn as seq 
    ,t_diag_icd9.diag_icd9_icd9_number AS procedure_code 
    ,b_icd9.icd9_description AS procedure_name 
    ,SubString(t_visit.visit_begin_visit_time from 1 for 10) as date_serv 
    ,SubString(t_visit.visit_begin_visit_time from 12 for 8) as time_serv 
    ,SubString(t_diag_icd9.diag_icd9_start_time from 1 for 10) as start_date
    ,SubString(t_diag_icd9.diag_icd9_finish_time from 1 for 10) as end_date
    ,SubString(t_diag_icd9.diag_icd9_start_time from 12 for 8) as start_time
    ,SubString(t_diag_icd9.diag_icd9_finish_time from 12 for 8) as end_time
    FROM t_visit 
    INNER JOIN t_diag_icd9 ON t_visit.t_visit_id = t_diag_icd9.diag_icd9_vn 
    INNER JOIN b_icd9 ON t_diag_icd9.diag_icd9_icd9_number = b_icd9.icd9_number 
    WHERE t_visit.f_visit_status_id <>'4' 
    AND t_diag_icd9.diag_icd9_active ='1'
    and t_visit.visit_vn = ?`, vn);
    return sql[0];
    // return [{seq:'',procedure_code:'',procedure_name:'',date_serv:'',time_serv:'',start_date:'',start_time:'',end_date:'',end_time:''}];
  }

  async getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    let sql = await db.raw(`
    Select 
      t_visit.visit_vn as seq, 
      t_order.order_qty as qty, 
      b_item_drug_uom.item_drug_uom_description as unit, 
      b_item.item_common_name as drug_name, 
      b_item_drug_frequency.item_drug_frequency_description as  usage_line1,
      '' as usage_line2,
      '' as usage_line3
      From 
      t_visit Inner Join 
      t_order 
      On t_visit.t_visit_id = t_order.t_visit_id Inner Join 
      t_order_drug 
      On t_order.t_order_id = t_order_drug.t_order_id Inner Join 
      b_item_drug_uom 
      On t_order_drug.b_item_drug_uom_id_use = b_item_drug_uom.b_item_drug_uom_id 
      Inner Join 
      b_item 
      On t_order.b_item_id = b_item.b_item_id Inner Join 
      b_item_subgroup 
      On b_item.b_item_subgroup_id = b_item_subgroup.b_item_subgroup_id Inner Join 
      b_item_drug_frequency 
      On t_order_drug.b_item_drug_frequency_id = 
      b_item_drug_frequency.b_item_drug_frequency_id 
      Where 
      t_order.f_order_status_id <> '3' And 
      b_item_subgroup.f_item_group_id = '1' and t_visit.visit_vn = ?`, seq)
    return sql[0];
  }

  async getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    let sql = await db.raw(`Select 
    t_visit.visit_vn as seq, 
    t_order.order_common_name As lab_name, 
    t_result_lab.result_lab_value || ' ' || t_result_lab.result_lab_unit As lab_result, 
    t_result_lab.result_lab_min || '-' || t_result_lab.result_lab_max ||  ' ' || t_result_lab.result_lab_unit As standard_result,
    substring(t_order.order_date_time from 1 for 10 ) as date_serv, 
    substring(t_order.order_date_time from 12 for 8 ) as time_serv 
    From 
    t_order Inner Join 
    t_visit 
    On t_order.t_visit_id = t_visit.t_visit_id Inner Join 
    t_result_lab 
    On t_order.t_order_id = t_result_lab.t_order_id 
    Where 
    t_order.f_item_group_id = '2' And 
    (t_order.f_order_status_id <> '3' Or 
    t_order.f_order_status_id <> '0') 
    and t_visit.visit_vn = ?
    Group By 
    t_visit.visit_vn, t_order.order_common_name, t_result_lab.result_lab_value || 
    ' ' || t_result_lab.result_lab_unit, t_result_lab.result_lab_min || '-' || 
    t_result_lab.result_lab_max || ' ' || t_result_lab.result_lab_unit`, seq);
    return sql[0];
    // return [{lab_name:'',lab_result:'',standard_result:'',seq:'',time_serv:'',date_serv:''}]
  }


  async getVaccine(db: Knex, hn: any) {
    let sql = await db.raw(``);
    return [];
  }

  async getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    let sql = await db.raw(`
    Select 
      '' as seq,
      t_patient.patient_hn, 
      SubString(t_patient_appointment.patient_appoint_date_time From 1 For 
      10 ) As date_serv, 
      SubString(t_patient_appointment.patient_appoint_date_time From 12 For 8 ) As 
      time_serv, 
      t_patient_appointment.patient_appointment_date as date, 
      t_patient_appointment.patient_appointment_time as time, 
      t_patient_appointment.patient_appointment as detail, 
      b_visit_clinic.visit_clinic_description as department
      From 
      t_patient_appointment Inner Join 
      b_visit_clinic 
      On t_patient_appointment.patient_appointment_clinic = 
      b_visit_clinic.b_visit_clinic_id Inner Join 
      t_patient 
      On t_patient_appointment.t_patient_id = t_patient.t_patient_id
      where t_patient.patient_hn = ? and  SubString(t_patient_appointment.patient_appoint_date_time From 1 For 
        10 ) = ?`, [hn, dateServ]);
    return sql[0];
  }

}