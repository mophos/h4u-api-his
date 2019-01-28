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
// } this.for.HospitalOS.by kom2005@gmail.com Bansang Hospital Prachin buri
 
export class HisHospitalOsModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db('b_site as s')
      .select('s.b_visit_office_id as provider_code', 's.site_name as provider_name')
  }

  getProfile(db: Knex, hn: any) {
    return db('t_patient')
    .select('f.patient_prefix_description as title_name', 'patient_firstname as first_name', 'patient_lastname as last_name')
    .leftJoin('f_patient_prefix as f','f.f_patient_prefix_id','t_patient.f_patient_prefix_id')
    .where('patient_hn', hn)
  }

  async getServices(db: Knex, hn: any, dateServ: any) {

    return db('t_visit')
    .select('t_visit.visit_vn as seq', (db.raw('substring(t_visit.visit_begin_visit_time,1,10)as date_serv')), (db.raw('substring(t_visit.visit_begin_visit_time,12,5)as time_serv')))
    .leftJoin('t_patient','t_patient.t_patient_id','=','t_visit.t_patient_id')
     .where('t_visit.f_visit_status_id','<>','4')
    .where('t_patient.patient_hn', hn)
    .whereRaw(`cast(cast(substr(t_visit.visit_begin_visit_time,1,4) as numeric) - 543|| (substr(t_visit.visit_begin_visit_time,5,6)) as date) = ?`,[dateServ]);
    
  }

  async getAllergyDetail(db: Knex, hn: any) {
    return db('t_patient_drug_allergy')
    .select('item_drug_standard_description as drug_name', 'drug_allergy_symtom as symptom')
    .leftJoin('t_patient','t_patient.t_patient_id','=','t_patient_drug_allergy.t_patient_id')
    .leftJoin('b_item_drug_standard','b_item_drug_standard.b_item_drug_standard_id','=','t_patient_drug_allergy.b_item_drug_standard_id')
    .where('t_patient.patient_hn', hn);
    // แพ้ยา
    // return [{drug_name:'',symptom:''}]
  }
  getChronic(db: Knex, hn: any) {
    return db('t_chronic as pc')
      .select('pc.chronic_icd10 as icd10_code', 'pc.chronic_diagnosis_date as  start_date', 'i.icd10_description_th as icd_name')
      .leftOuterJoin('b_icd10 as i', 'i.icd10_number', '=', 'pc.chronic_icd10')
      .where('pc.chronic_active','1')
      .where('pc.chronic_hn', hn)
      .orderBy('start_date','desc');
  }
  async getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('t_visit as vs')
    .select('visit_vn as seq',  (db.raw('substring(vs.visit_begin_visit_time,1,10)as date_serv')), (db.raw('substring(vs.visit_begin_visit_time,12,5)as time_serv'))
    , 'i.diag_icd10_number  as icd_code', 'b_icd10.icd10_description_th as icd_name', 'd.diag_icd10_type_description as diag_type')
    .leftOuterJoin('t_diag_icd10 as i', ' i.diag_icd10_vn', '=', 'vs.t_visit_id')
    .leftOuterJoin('b_icd10', 'b_icd10.icd10_number', '=', 'i.diag_icd10_number')
    .leftOuterJoin('f_diag_icd10_type as d', 'd.f_diag_icd10_type_id', '=', 'i.f_diag_icd10_type_id')
    .where('i.diag_icd10_active','1')
    .where('vs.visit_vn', seq);
    // return [{icd_code:'',icd_name:'',diage_type:''}]
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('t_visit as vs')
    .select('visit_vn as seq', (db.raw('substring(vs.visit_begin_visit_time,1,10)as date_serv')), (db.raw('substring(vs.visit_begin_visit_time,12,5)as time_serv'))
    , 'i.diag_icd9_icd9_number  as procedure_code', 'b_icd9.icd9_description as procedure_name', 'd.diagnosis_operation_type_description as diag_type'
    ,(db.raw('substr(i.diag_icd9_start_time,1,10) as start_date')), (db.raw('substr(i.diag_icd9_finish_time,1,10) as end_date')))
    .leftOuterJoin('t_diag_icd9 as i', ' i.diag_icd9_vn', '=', 'vs.t_visit_id')
    .leftOuterJoin('b_icd9', 'b_icd9.icd9_number', '=', 'i.diag_icd9_icd9_number')
    .leftOuterJoin('f_diagnosis_operation_type as d', 'd.f_diagnosis_operation_type_id', '=', 'i.f_diagnosis_operation_type_id')
    .where('i.diag_icd9_active','1')
    .where('vs.visit_vn', vn);
    // return [{seq:'',procedure_code:'',procedure_name:'',date_serv:'',time_serv:'',start_date:'',start_time:'',end_date:'',end_time:''}];
 
  }

  getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('t_visit as vs ')
      .select('visit_vn as seq', (db.raw('substring(vs.visit_begin_visit_time,1,10)as date_serv')), (db.raw('substring(vs.visit_begin_visit_time,12,5)as time_serv'))
      , 'r.visit_refer_in_out_refer_hospital as to_provider_code', 'h.visit_office_name as to_provider_name',
        'f_refer_cause.refer_cause_description as reason','r.refer_date  as start_date')
      .innerJoin('t_visit_refer_in_out as r', 'r.t_visit_id', 'vs.t_visit_id')
      .leftJoin('f_refer_cause', 'f_refer_cause.f_refer_cause_id', 'r.visit_refer_in_out_cause')
      .leftOuterJoin('b_visit_office as h', 'h.b_visit_office_id', 'r.visit_refer_in_out_refer_hospital')
      .where('r.visit_refer_in_out_active','1')
      .where('r.f_visit_refer_type_id','1')
      .where('vs.visit_vn', vn);
  }

  async getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('t_order as  o')
    .select('o.order_common_name as drug_name','o.order_qty as qty','bd.item_drug_uom_description as unit'
  ,'bf.item_drug_frequency_description as usage_line1','d.order_drug_description as usage_line2','d.order_drug_caution as usage_line3')
  .innerJoin('t_visit as  vs', 'vs.t_visit_id', 'o.t_visit_id')
  .innerJoin('t_order_drug as  d', 'd.t_order_id', 'o.t_order_id')
  .innerJoin('b_item_drug_uom as   bd', 'bd.b_item_drug_uom_id', 'd.b_item_drug_uom_id_use')
  .innerJoin('b_item_drug_frequency as bf', 'bf.b_item_drug_frequency_id', 'd.b_item_drug_frequency_id')
  .where('o.f_item_group_id','1')
  .whereNotIn('o.f_order_status_id',[0,3])
    .where('vs.visit_vn', seq)
    .groupBy('o.order_common_name','o.order_qty','bd.item_drug_uom_description',    
      'bf.item_drug_frequency_description','d.order_drug_description','d.order_drug_caution');

  }

  getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('t_order as o')
      .select('vs.visit_vn as seq','o.order_common_name as lab_name', (db.raw(`l.result_lab_value ||' '|| l.result_lab_unit As lab_result`)) 
      , (db.raw(`l.result_lab_min || '-' || l.result_lab_max ||  ' ' || l.result_lab_unit As standard_result`))
      ,  (db.raw('substring(o.order_date_time,1,10)as date_serv')), (db.raw('substring(o.order_date_time,12,5)as time_serv')) )
      .innerJoin('t_visit as  vs', 'vs.t_visit_id', 'o.t_visit_id')
      .innerJoin('t_result_lab as  l', 'l.t_order_id', 'o.t_order_id')
      .where('o.f_item_group_id','2')
      .whereNotIn('o.f_order_status_id',[0,3])
      .where('vs.visit_vn', vn);
  }

   getVaccine(db: Knex, hn: any) {
   
    return db('t_visit as vs')
    .select('visit_vn as seq', 'e.epi_survey_date as date_serv', (db.raw('substring(vs.visit_begin_visit_time,12,5)as time_serv')),
  'h.health_epi_group_description_particular as vaccine_code','h.health_epi_group_description as vaccine_name')
    .innerJoin('t_health_epi as e','e.t_visit_id','vs.t_visit_id')
    .leftJoin('t_health_epi_detail as ed ', 'ed.t_health_epi_id', 'e.t_health_epi_id')
    .leftOuterJoin('b_health_epi_group as h', 'h.b_health_epi_group_id', 'ed.b_health_epi_set_id')
    .where('e.health_epi_active','1')
    .where('vs.visit_hn', hn);
   
  }

  getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    return db('t_patient_appointment  as t')
      .select('t.patient_appointment_date as date','t.patient_appointment_time as time', 'b.visit_clinic_description as department','t.patient_appointment as detail')
      .innerJoin('b_visit_clinic as  b', 't.patient_appointment_clinic', 'b.b_visit_clinic_id')
      .innerJoin('t_visit as  vs', 'vs.t_visit_id', 't.t_visit_id')
      .where('t.patient_appointment_active','1')
      .where('vs.visit_hn', hn)   
      .whereRaw(`cast(cast(substr(vs.visit_begin_visit_time,1,4) as numeric) - 543|| (substr(vs.visit_begin_visit_time,5,6)) as date) = ?`,[dateServ]);
  }
   // return [{date:'',time:'',department:'',detail:''}]

}

//http://127.0.0.1:3001/services/view/000036877/2561-10-12/3b45cad2-52e8-4c5f-9e51-088b3f4bb8ce/465230ce-2e7a-49c4-9254-fd145b9cb3d2
//http://127.0.0.1:3001/services/view/000036877/2018-10-12/3b45cad2-52e8-4c5f-9e51-088b3f4bb8ce/465230ce-2e7a-49c4-9254-fd145b9cb3d2