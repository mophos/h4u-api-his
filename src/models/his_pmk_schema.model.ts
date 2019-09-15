import Knex = require('knex');
const schema = process.env.DB_SCHEMA;
export class HisPmkSchemaModel {

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
      .select('HN as hn', 'SEQ as seq',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe]);

  }

  getAllergyDetail(db: Knex, hn: any) {
    return db(`${schema}.H4U_ALLERGY`)
      .select('DRUG_NAME as drug_name', 'SYMPTOM as symptom')
      .where('HN', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db(`${schema}.H4U_CHRONIC`)
      .select('ICD_CODE as icd_code', 'ICD_NAME as icd_name',
        db.raw(`to_char(START_DATE,'YYYY-MM-DD') as start_date`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn);
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DIAGNOSIS`)
      .select('ICD_CODE as icd_code', 'ICD_NAME as icd_name', 'DIAG_TYPE as diag_type',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('SEQ', seq);
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_REFER`)
      .select('HCODE_TO as hcode_to', 'NAME_TO as name_to', 'REASON as reason',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('SEQ', seq);
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_PROCEDURE`)
      .select('PROCEDURE_CODE as procedure_code', 'PROCEDURE_NAME as procedure_name',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`),
        db.raw(`to_char(START_DATE,'YYYY-MM-DD') as start_date`),
        db.raw(`to_char(START_TIME,'HH24:MI:SS') as start_time`),
        db.raw(`to_char(END_DATE,'YYYY-MM-DD') as end_date`),
        db.raw(`to_char(END_TIME,'HH24:MI:SS') as end_time`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('SEQ', seq);
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_DRUG`)
      .select('DRUG_NAME as drug_name', 'QTY as qty', 'UNIT as unit',
        'USAGE_LINE1 as usage_line1', 'USAGE_LINE2 as usage_line2', 'USAGE_LINE3 as usage_line3',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('OPD_NO', seq);
    // .where('SEQ', seq);
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_LAB`)
      .select('LAB_NAME as lab_name', 'LAB_RESULT as lab_result', 'STANDARD_RESULT as standard_result',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('SEQ', seq);
  }


  getAppointment(db: Knex, hn: any, dateServe: any, seq: any) {
    return db(`${schema}.H4U_APPOINTMENT`)
      .select('D_DATE as date', 'D_TIME as time', 'DEPARTMENT as department', 'DETAIL as detail',
        // .select('APPOINTMENT_DATE as date', 'APPOINTMENT_TIME as time', 'DEPARTMENT as department', 'DETAIL as detail',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn)
      .whereRaw(`to_char(DATE_SERVE,'YYYY-MM-DD')=?`, [dateServe])
      .where('SEQ', seq);
  }

  getVaccine(db: Knex, hn: any) {
    return db(`${schema}.H4U_VACCINE`)
      .select('VACCINE_CODE as vaccine_code', 'VACCINE_NAME as vaccine_name',
        db.raw(`to_char(DATE_SERVE,'YYYY-MM-DD') as date_serv`),
        db.raw(`to_char(TIME_SERVE,'HH24:MI:SS') as time_serv`))
      .where('HN', hn);
  }

}
