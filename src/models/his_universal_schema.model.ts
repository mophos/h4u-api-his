import Knex = require('knex');
const schema = process.env.SCHEMA;
export class HisUniversalSchemaModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db(`${schema}.H4U_HOSPITAL`)
      .select('PROVIDER_CODE', 'PROVIDER_NAME')
      .where('PROVIDER_CODE', providerCode)
  }

  getProfile(db: Knex, hn: any) {
    return db(`${schema}.H4U_PROFILE`)
      .select('HN', 'CID', 'TITLE_NAME', 'FIRST_NAME', 'LAST_NAME')
      .where('HN', hn)
  }

  getServices(db: Knex, hn: any, dateServe: any) {
    return db(`${schema}.H4U_SERVICE`)
      .select('HN', 'SEQ', 'DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)


  }

  getAllergyDetail(db: Knex, hn: any) {
    return db(`${schema}.H4U_ALLERGY`)
      .select('DRUG_NAME', 'SYMPTOM')
      .where('HN', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db(`${schema}.H4U_CHRONIC`)
      .select('ICD_CODE', 'ICD_NAME', 'START_DATE', 'TIME_SERVE AS TIME_SERV')
      .where('HN', hn);
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DIAGNOSIS`)
      .select('ICD_CODE', 'ICD_NAME', 'DIAG_TYPE', 'DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_REFER`)
      .select('HCODE_TO', 'NAME_TO', 'REASON', 'TIME_SERVE AS TIME_SERV', 'DATE_SERVE AS DATE_SERV')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_PROCEDURE`)
      .select('PROCEDURE_CODE', 'PROCEDURE_NAME', 'DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV', 'START_DATE',
        'START_TIME', 'END_DATE', 'END_TIME')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DRUG`)
      .select('DRUG_NAME', 'DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV', 'QTY', 'UNIT', 'USAGE_LINE1', 'USAGE_LINE2', 'USAGE_LINE3')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_LAB`)
      .select('LAB_NAME', 'LAB_RESULT', 'STANDARD_RESULT', 'TIME_SERVE AS TIME_SERV', 'DATE_SERVE AS DATE_SERV')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }


  getAppointment(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_APPOINTMENT`)
      .select('APPOINTMENT_DATE as DATE', 'APPOINTMENT_TIME as TIME', 'DEPARTMENT', 'DETAIL', 'DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV')
      .where('HN', hn)
      .where('DATE_SERVE', dateServe)
      .where('SEQ', seq);
  }

  getVaccine(db: Knex, hn: any) {
    return db(`${schema}.H4U_VACCINE`)
      .select('DATE_SERVE AS DATE_SERV', 'TIME_SERVE AS TIME_SERV', 'VACCINE_CODE', 'VACCINE_NAME')
      .where('HN', hn);
  }

}
