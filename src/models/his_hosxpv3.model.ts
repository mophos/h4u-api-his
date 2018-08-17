import Knex = require('knex');
import * as moment from 'moment';
import { REQUEST_TOO_LONG } from 'http-status-codes';
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
      .innerJoin('kskdepartment as k', 'k.depcode', 'v.main_dep')
      .where('v.hn', hn)
      .where('v.vstdate', dateServe)
  }

  getSeq(db: Knex, dateServe: any, hn: any) {
    return db('ovst as o')
      .select('o.vn as seq', 'o.vn as visitno', 'o.vstdate as date', 'o.vsttime as time', 'k.department')
      .leftOuterJoin('kskdepartment as k', 'k.depcode', 'o.main_dep')
      .whereRaw(`DATE(o.vstdate) = ${dateServe} and o.hn = ${hn}`);
  }

  getPtDetail(db: Knex, hn: any) {
    return db('patient')
      .select('cid', 'pname as title_name', 'fname as first_name', 'lname as last_name')
      .where('hn', hn);
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('opd_allergy')
    .select('agent as drug_name', 'symptom')
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
    .select('pc.regdate as start_date', 'pc.icd10 as icd10_code', 'i.name as icd_name')
      .leftOuterJoin('person as pe', 'pe.cid', '=', 'pc.cid')
      .leftOuterJoin('patient as pa', 'pa.hn', '=', 'pe.hn')
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
      .select('o.bw as weight', 'o.height', 'o.bpd as dbp', 'o.bps as sbp', 'o.bmi')
      .where('vn', vn);
  }
  getPe(db: Knex, vn: any) {
    return db('opdscreen as v')
      .select('v.pe as pe')
      .where('v.vn', vn);
  }

  getDiagnosis(db: Knex, vn: any) {
    return db('ovstdiag as o')
      .select('o.vn', 'o.vstdate as date_serv',
      'o.vsttime as time_serv', 'o.icd10 as icd10_code', 'i.name as icd10_desc', 't.name as diag_type')
      .leftOuterJoin('icd101 as i', 'i.code', '=', 'o.icd10')
      .leftOuterJoin('diagtype as t', 't.diagtype', 'o.diagtype')
      .where('vn', vn);
  }

  getProcedure(db: Knex, vn: any) {
    return db.raw(`SELECT d.er_oper_code as procedure_code,e.name as procedure_name,date(d.begin_date_time) as start_date, 
    time(d.begin_date_time) as start_time,
    date(d.end_date_time) as end_date,TIME(d.end_date_time) as end_time
    FROM doctor_operation as d
    LEFT OUTER JOIN ovst o on o.vn=d.vn
    LEFT OUTER JOIN er_oper_code as e on e.er_oper_code=d.er_oper_code
    WHERE o.hn = '?'
    UNION
    SELECT e.er_oper_code as procedure_code,c.name as procedure_name,o.vstdate as start_date, 
    time(e.begin_time) as start_time,o.vstdate as end_date,TIME(e.end_time) as end_date
    FROM er_regist_oper as e
    LEFT OUTER JOIN ovst o on o.vn=e.vn
    LEFT OUTER JOIN er_oper_code as c on c.er_oper_code=e.er_oper_code
    WHERE o.hn = '?'
    `);
  }

  getRefer(db: Knex, vn: any) {
    return db('referout as r')
      .select('o.vn as seq', 'o.vstdate as date_serv',
      'o.vsttime as time_serv', 'r.refer_hospcode as to_provider_code', 'h.name as to_provider_name',
      'c.name as refer_cause')
      .innerJoin('refer_cause as c', 'c.id', 'r.refer_cause')
      .innerJoin('ovst as o ', 'o.vn', 'r.vn')
      .innerJoin('hospcode as h', 'h.hospcode', 'r.refer_hospcode')
      .where('r.vn', vn);
  }

  getDrugs(db: Knex, vn: any) {
    return db('opitemrece as o')
      .select('o.vn','o.vstdate as date_serv','o.vsttime as time_serv',
      'o.icode as drugcode', 's.name as drug_name', 'o.qty', 's.units as unit',
      'u.name1 as usage_line1', 'u.name2 as usage_line2', 'u.name3 as usage_line3', )
      .innerJoin('s_drugitems as s', 's.icode', 'o.icode')
      .innerJoin('drugusage as u', 'u.drugusage', 'o.drugusage')
      .where('o.vn', vn)
  }

  getLabs(db: Knex, vn: any) {
    return db('lab_order as l')
      .select('o.vstdate as date_serv','o.vsttime as time_serv',
      'o.vn','l.lab_items_name_ref as lab_name', 'l.lab_order_result as lab_result',
      'l.lab_items_normal_value_ref as standard_resul')
      .innerJoin('lab_head as h', 'h.lab_order_number', 'l.lab_order_number')
      .innerJoin('ovst as o', 'o.vn', 'h.vn')
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
    return db('person_vaccine_list as l')
    .select(db.raw(`o.vstdate as date_serve,o.vsttime as time_serve,v.vaccine_code,v.vaccine_name`))
    .innerJoin('person as p', 'p.person_id', 'l.person_id')
    .innerJoin('patient as e', 'e.cid', 'p.cid')
    .innerJoin('ovst as o', 'o.hn', 'e.hn')
    .innerJoin('person_vaccine as v', 'v.person_vaccine_id', 'l.person_vaccine_id')
    .where('o.vn', vn)
    .union(function () {
      this.select(db.raw(`o.vstdate as date_serve,o.vsttime as time_serve,v.vaccine_code,v.vaccine_name`))
        .innerJoin('ovst as o', 'o.vn', 'l.vn')
        .innerJoin('person_vaccine as v', 'v.person_vaccine_id', 'l.person_vaccine_id')
        .from('ovst_vaccine as l')
        .where('o.vn', vn);
    })
  }

  // getEpi(db: Knex, hn: any) {
  //   return db.raw(`SELECT (select hospitalcode from opdconfig) as provider_code,(select hospitalname from opdconfig) as provider_name,
  //   v.vaccine_code, v.vaccine_name, l.vaccine_date as date_serve, '' as time_serve
  //   FROM person_vaccine_list l 
  //   LEFT OUTER JOIN person p on p.person_id=l.person_id
  //   LEFT OUTER JOIN patient e on e.cid=p.cid
  //   LEFT OUTER JOIN ovst o on o.hn = e.hn
  //   LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
  //   where o.hn = '?'
  //   UNION
  //   SELECT (select hospitalcode from opdconfig) as provider_code, (select hospitalname from opdconfig) as provider_name, 
  //   v.vaccine_code, v.vaccine_name, o.vstdate as date_serve,o.vsttime as time_serve
  //   FROM ovst_vaccine l 
  //   LEFT OUTER JOIN ovst o on o.vn=l.vn
  //   LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
  //   where o.hn = '?'
  //   `);
  // }

  getEpi(db: Knex, hn: any) {
    return db('person_vaccine_list as l')
    .select(db.raw(`l.vaccine_date as date_serve,'' as time_serve,v.vaccine_code,v.vaccine_name`))
      .innerJoin('person as p', 'p.person_id', 'l.person_id')
      .innerJoin('patient as e', 'e.cid', 'p.cid')
      .innerJoin('ovst as o', 'o.hn', 'e.hn')
      .innerJoin('person_vaccine as v', 'v.person_vaccine_id', 'l.person_vaccine_id')
      .where('o.hn', hn)
      .union(function () {
        this.select(db.raw(`o.vstdate as date_serve,o.vsttime as time_serve,v.vaccine_code,v.vaccine_name`))
          .innerJoin('ovst as o', 'o.vn', 'l.vn')
          .innerJoin('person_vaccine as v', 'v.person_vaccine_id', 'l.person_vaccine_id')
          .from('ovst_vaccine as l')
          .where('o.hn', hn);
      })
  }

  getAppointment(db: Knex, vn: any) {
    return db('oapp as o')
      .select('o.vn', 'v.vstdate as date_serv', 'v.vsttime as time_serv',
      'c.name as department', 'o.nextdate as date', 'o.nexttime as time', 'o.app_cause as detail')
      .innerJoin('ovst as v', 'v.vn', 'o.vn')
      .innerJoin('clinic as c', 'c.clinic', 'o.clinic')
      .where('o.vn', vn);
  }

}