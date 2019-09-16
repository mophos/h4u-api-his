import Knex = require('knex');
const schema = process.env.DB_SCHEMA;
export class HisUniversalSchemaModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db(`${schema}.H4U_HOSPITAL`)
      .select('PROVIDER_CODE as provider_code', 'PROVIDER_NAME as provider_name')
      .where('PROVIDER_CODE', providerCode)
  }

  getProfile(db: Knex, hn: any) {
    return db(`${schema}.H4U_PROFILE`)
      .select('HN as hn', 'CID as cid', 'TITLE_NAME as title_name',
        'FIRST_NAME as first_name', 'LAST_NAME as last_name')
      .where('HN', hn)
  }

  getServices(db: Knex, hn: any, dateServe: any) {
    return db(`${schema}.H4U_SERVICE`)
      .select('HN as hn', 'SEQ as seq', 'DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)


  }

  getAllergyDetail(db: Knex, hn: any) {
    return db(`${schema}.H4U_ALLERGY`)
      .select('DRUG_NAME as drug_name', 'SYMPTOM as symptom')
      .where('HN', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db(`${schema}.H4U_CHRONIC`)
      .select('ICD_CODE as icd_code', 'ICD_NAME as icd_name',
        'START_DATE as start_date', 'TIME_SERVE AS time_serv')
      .where('HN', hn);
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DIAGNOSIS`)
      .select('ICD_CODE as icd_code', 'ICD_NAME as icd_name', 'DIAG_TYPE as diag_type',
        'DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_REFER`)
      .select('HCODE_TO as hcode_to', 'NAME_TO as name_to', 'REASON as reason',
        'TIME_SERVE AS time_serv', 'DATE_SERVE AS date_serv')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_PROCEDURE`)
      .select('PROCEDURE_CODE as procedure_code', 'PROCEDURE_NAME as procedure_name',
        'DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv', 'START_DATE as start_date',
        'START_TIME as start_time', 'END_DATE as end_date', 'END_TIME as end_time')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DRUG`)
      .select('DRUG_NAME as drug_name', 'DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv',
        'QTY as qty', 'UNIT as unit', 'USAGE_LINE1 as usage_line1', 'USAGE_LINE2 as usage_line2', 'USAGE_LINE3 as usage_line3')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_LAB`)
      .select('LAB_NAME as lab_name', 'LAB_RESULT as lab_result', 'STANDARD_RESULT as standard_result',
        'TIME_SERVE AS time_serv', 'DATE_SERVE AS date_serv')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }


  getAppointment(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_APPOINTMENT`)
      .select('APPOINTMENT_DATE as date', 'APPOINTMENT_TIME as time', 'DEPARTMENT as department',
        'DETAIL as detail', 'DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getVaccine(db: Knex, hn: any) {
    return db(`${schema}.H4U_VACCINE`)
      .select('DATE_SERVE AS date_serv', 'TIME_SERVE AS time_serv',
        'VACCINE_CODE as vaccine_code', 'VACCINE_NAME as vaccine_name')
      .where('HN', hn);
  }

}
