import Knex = require('knex');
export class HisUniversalModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db('h4u_hospital')
      .select('provider_code', 'provider_name')
      .where('provider_code', providerCode)
  }

  getProfile(db: Knex, hn: any) {
    return db('h4u_profile')
      .select('hn', 'cid', 'title_name', 'first_name', 'last_name')
      .where('hn', hn)
  }

  getServices(db: Knex, hn: any, dateServe: any) {
    return db('h4u_service')
      .select('hn', 'seq', 'date_serve', 'time_serv')
      .where('hn', hn)
      .where('date_serve', dateServe)

  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('h4u_allergy')
      .select('drug_name', 'symptom')
      .where('hn', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db('h4u_chronic')
      .select('icd_code', 'icd_name', 'start_date')
      .where('hn', hn);
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_diagnosis')
      .select('icd_code', 'icd_name', 'diage_type')
      .where('hn', hn)
      .where('date_serve', dateServe)
      .where('seq', seq);
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_refer')
      .select('hcode_to', 'name_to', 'reason')
      .where('hn', hn)
      .where('date_serve', dateServe)
      .where('seq', seq);
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_procedure')
      .select('procedure_code', 'procedure_name', 'date_serve', 'time_serv', 'start_date',
        'start_time', 'end_date', 'end_time')
      .where('hn', hn)
      .where('date_serve', dateServe)
      .where('seq', seq);
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_drug')
      .select('drug_name', 'qty', 'unit', 'usage_line1', 'usage_line2',
        'start_time', 'end_date', 'end_time')
      .where('hn', hn)
      .where('date_serve', dateServe)
      .where('seq', seq);
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_lab')
      .select('lab_name', 'lab_result', 'standard_result', 'time_serv', 'date_serve')
      .where('hn', hn)
      .where('date_serve', dateServe)
      .where('seq', seq);
  }


  getAppointment(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('h4u_appointment')
      .select('date', 'time', 'department', 'detail')
      .where('hn', hn)
      .where('dateServe', dateServe)
      .where('seq', seq);
  }

  getVaccine(db: Knex, hn: any) {
    return db('h4u_vaccine')
      .select('date_serve', 'time_serv', 'vaccine_code', 'vaccine_name')
      .where('hn', hn);
  }

}
