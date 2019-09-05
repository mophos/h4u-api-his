import Knex = require('knex');

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
export class HisMkhospitalModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db('hospital')
      .select('code as provider_code', 'name as provider_name')
      .limit(1);
  }

  getProfile(db: Knex, hn: any) {
    return db('patient')
      .select('hn', 'cid', 'title as title_name', 'name as first_name', 'surname as last_name')
      .where('hn', hn);
  }

  async getServices(db: Knex, hn: any, dateServe: any) {
    let sql = await db.raw(`SELECT vn as seq,DATE_FORMAT(date_serv, '%Y-%m-%d') as date_serv,time_serv
    from service WHERE hn = ? and date_serv = ?
    `, [hn, dateServe]);
    return sql[0];
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('allergy')
      .select('drug_name', 'symptom')
      .where('hn', hn);
  }

  getChronic(db: Knex, hn: any) {
    return db('chronic')
      .select('icd_code', 'icd_name', 'start_date', 'time_serv')
      .where('hn', hn);
  }

  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('diagnosis')
      .select('seq', 'date_serv', 'icd_code', 'icd_name', 'diag_type', 'time_serv')
      .where('seq', vn);
  }

  getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('refer')
      .select('seq', 'date_serv', 'hcode_to', 'name_to', 'reason', 'time_serv')
      .where('seq', vn);
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    return db('drugs')
      .select('seq', 'date_serv', 'time_serv', 'drug_name', 'qty', 'unit', 'usage_line1', 'usage_line2', 'usage_line3')
      .where('seq', vn);
  }

  getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('lab')
      .select('seq', 'date_serv', 'time_serv', 'lab_name', 'lab_result', 'standard_result')
      .where('seq', vn);
  }

  getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    return db('appointment')
      .select('seq', 'date_serv', 'time_serv', 'date', 'time', 'department', 'detail')
      .where('seq', vn);
  }

  getVaccine(db: Knex, hn: any) {
    return db('vaccines')
      .select('date_serv', 'time_serv', 'vaccine_code', 'vaccine_name')
      .where('hn', hn);
  }

  getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('procedure_data')
      .select('seq', 'date_serv', 'time_serv', 'procedure_code', 'procedure_name', 'start_date', 'start_time', 'end_date', 'end_time')
      .where('seq', vn);
  }


}
