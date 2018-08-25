import Knex = require('knex');
// ตัวอย่าง query แบบ knex
// getHospital(db: Knex) {
//   return db('opdconfig as o')
//     .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
// }
// ตัวอย่างการคิวรี่โดยใช้ raw MySqlConnectionConfig
// async getHospital(db: Knex) {
//   let data = await knex.raw(`select * from opdconfig`);
// return data[0];
// }
export class HisMbaseModel {
  async getTableName(db: Knex) {
    let data = await db.raw(``);
    return data[0];
  }
  async getHospital(db: Knex) {
    let data = await db.raw(``);
    return data[0];
  }

  async getServices(db: Knex, date_serve: any, hn: any) {

    let data = await db.raw(`
    select o.vn as seq, o.vstdttm as date, o.nrxtime as time, c.namecln as department
    FROM ovst as o 
    Inner Join cln as c ON c.cln = o.cln 
    WHERE DATE(o.vstdttm) = '${date_serve}' and o.hn ='${hn}'`);
    return data[0];
  }


  async getAllergyDetail(db: Knex, hn: any) {
    let data = await db.raw(``);
    return data[0];
  }

  async getChronic(db: Knex, hn: any) {
    let data = await db.raw(``);
    return data[0];
  }


  async getDiagnosis(db: Knex, vn: any) {
    let data = await db.raw(``);
    return data[0];
  }

  async getRefer(db: Knex, vn: any) {
    let data = await db.raw(``);
    return data[0];
  }


  async getDrugs(db: Knex, vn: any) {
    let data = await db.raw(``);
    return data[0];
  }

  async getLabs(db: Knex, vn: any) {
    let data = await db.raw(``);
    return data[0];
  }


  async getAppointment(db: Knex, vn: any) {
    let data = await db.raw(``);
    return data[0];
  }

  async getVaccine(db: Knex, hn: any) {
    let data = await db.raw(``);
    return data[0];
  }


}