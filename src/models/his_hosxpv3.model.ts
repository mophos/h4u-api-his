import Knex = require('knex');
import * as moment from 'moment';
const dbName = process.env.HIS_DB_NAME;

export class HisHosxpv3Model {
  getTableName(knex: Knex) {
    return knex
      .select('TABLE_NAME')
      .from('information_schema.tables')
      .where('TABLE_SCHEMA', '=', dbName);
  }

  getHospital(db: Knex) {
    return db('opdconfig as o')
      .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
  }

  getServices(db: Knex, hn, dateServe) {
    return db('ovst as v')
      .select(db.raw(`v.vstdate as date_serve, v.vsttime as time_serve, k.department as clinic,
          v.vn as seq, v.vn`))
      .innerJoin('kskdepartment as k', 'k.depcode','v.main_dep')
      .where('v.hn', hn)
      .where('v.vstdate', dateServe)
  }

  getSeq(db: Knex, dateServe: any, hn: any) {
    return db('ovst as o')
    .select('o.vn as seq','o.vn as visitno','o.vstdate as date','o.vsttime as time','k.department')
    .leftOuterJoin('kskdepartment as k','k.depcode','o.main_dep')
    .whereRaw(`DATE(o.vstdate) = ${dateServe} and o.hn = ${hn}`);
  }

  getPtDetail(db: Knex, hn: any) {
    return db('patient')
      .select('cid', 'pname as title_name', 'fname as first_name', 'lname as last_name')
      .where('hn', hn);
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('opd_allergy')
      .select('agent as drug_name', 'symptom as symptom_desc')
      .where('hn', hn);
  }

  getBloodgrp(db: Knex, hn: any) {
    return db('patient')
      .select('bloodgrp as blood_group')
      .where('hn', hn);
  }
  getSex(db: Knex, hn: any) {
    return db('patient')
      .select('sex')
      .where('hn', hn);
  }

  getDisease(db: Knex, hn: any) {
    return db('person_chronic as pc')
      .select('pc.icd10 as ICD10_code', 'i.name as ICD10_desc')
      .leftOuterJoin('patient as pa', 'pa.hn', '=', 'pc.hn')
      .leftOuterJoin('person as pe', 'pe.cid', '=', 'pa.cid')
      .leftOuterJoin('icd101 as i', 'i.code', '=', 'pc.icd10')
      .where('pa.hn', hn);
  }

  getDate(db: Knex, vn: any) {
    return db('ovst as o')
      .select('o.vstdate as date')
      .where('vn', vn);
  }

  getTime(db: Knex, vn: any) {
    return db('ovst as o')
      .select('o.vsttime as time')
      .where('vn', vn);
  }

  getDepartment(db: Knex, vn: any) {
    return db('ovst as o')
      .select('k.department')
      .innerJoin('kskdepartment as k', 'k.depcode', '=', 'o.main_dep')
      .where('vn', vn);
  }

  getScreening(db: Knex, vn: any) {
    return db('opdscreen as o')
      .select('o.bw as weigth', 'o.height', 'o.bpd as dbp', 'o.bps as sbp', 'o.bmi')
      .where('vn', vn);
  }
  getPe(db: Knex, vn: any) {
    return db('opdscreen as v')
      .select('v.pe as pe')
      .where('v.vn', vn);
  }

  getDiagnosis(db: Knex, vn: any) {
    return db('ovstdiag as o')
      .select('o.icd10 as icd10_code', 'i.name as icd10_desc', 'o.diagtype as diage_type')
      .leftOuterJoin('icd101 as i', 'i.code', '=', 'o.icd10')
      .where('vn', vn);
  }

  getRefer(db: Knex, vn: any) {
    return db('referout as r')
      .select('r.refer_hospcode', 'c.name as refer_cause')
      .innerJoin('refer_cause as c', 'c.id', 'r.refer_cause')
      .where('r.vn', vn);
  }

  getDrugs(db: Knex, vn:any) {
    return db('opitemrece as o')
      .select('o.vn', 'o.icode as drugcode', 's.name as drug_name', 'o.qty', 's.units as unit',
        'u.name1 as usage_line1', 'u.name2 as usage_line2', 'u.name3 as usage_line3')
      .innerJoin('s_drugitems as s', 's.icode', 'o.icode')
      .innerJoin('drugusage as u', 'u.drugusage', 'o.drugusage')
      .where('o.vn', vn)
  }

  getLabs(db: Knex, vn:any) {
    return db('lab_order as l')
      .select(db.raw(`l.lab_items_name_ref AS lab_name,
    l.lab_order_result as lab_result,
    l.lab_items_normal_value_ref as standard_result`))
      .innerJoin('lab_head as h', 'h.lab_order_number', 'l.lab_order_number')
      .where('h.vn', vn)
  }

  getAnc(db: Knex, vn: any, hn) {
    return db('person_anc as a')
      .select('a.preg_no as ga', 'a.current_preg_age as anc_no', 's.service_result as result')
      .innerJoin('person as p', 'p.person_id', 'a.person_id')
      .innerJoin('patient as e', 'e.cid', 'p.cid')
      .innerJoin('ovst as v', 'v.hn', 'e.hn')
      .innerJoin('person_anc_service as s', 's.person_anc_id', 'a.person_anc_id')
      .whereRaw('a.discharge <> "Y" or a.discharge IS NULL')
      .where('v.vn', vn)
      .where('e.hn', hn)
  }

  getVaccine(db: Knex, vn: any) {
    let sql = `o.vstdate as date_serve,SELECT v.vaccine_code, v.vaccine_name
    FROM person_vaccine_list l 
    LEFT OUTER JOIN person p on p.person_id=l.person_id
    LEFT OUTER JOIN patient e on e.cid=p.cid
    LEFT OUTER JOIN ovst o on o.hn = e.hn
    LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
    where o.hn = ?
    UNION
    SELECT o.vstdate as date_serve,v.vaccine_code, v.vaccine_name
    FROM ovst_vaccine l 
    LEFT OUTER JOIN ovst o on o.vn=l.vn
    LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
    where o.hn = ? `;
    return db.raw(sql, [vn, vn]);
  }


  getAppointment(db: Knex, vn: any) {
    return db('oapp as o')
      .select('o.nextdate as date', 'o.nexttime as time', 'c.name as department', 'o.app_cause as detail')
      .innerJoin('ovst as v', 'v.vn', 'o.vn')
      .innerJoin('clinic as c', 'c.clinic', 'o.clinic')
      .where('o.vn', vn);
  }

}