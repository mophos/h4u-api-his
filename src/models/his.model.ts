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
export class HisModel {
  
  getHospital(db: Knex, providerCode: any, hn: any) {
    // ชื่อสถานพยาบาล
    // return [{provider_code:'',provider_name:''}]
  }

  getProfile(db: Knex, hn: any) {
    // ชื่อผู้ป่วย
    // return [{hn:'',cid:'',title_name:'',first_name:'',last_name:''}]
  }

  async getServices(db: Knex, hn: any, dateServe: any) {
    // 
  }

  getAllergyDetail(db: Knex, hn: any) {
    // แพ้ยา
    // return [{drug_name:'',symptom:''}]
  }

  getChronic(db: Knex, hn: any) {
    // โรคเรื้อรัง
    // return [{icd_code:'',icd_name:'',start_date:''}]
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{icd_code:'',icd_name:'',diage_type:''}]
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{hcode_to:'',name_to:'',reason:''}]
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    // return [{seq:'',procedure_code:'',procedure_name:'',date_serv:'',time_serv:'',start_date:'',start_time:'',end_date:'',end_time:''}];
  }

  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{drug_name:'',qty:'',unit:'',usage_line1:'',usage_line2:'',usage_line3:''}]
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{lab_name:'',lab_result:'',standard_result:'',seq:'',time_serv:'',date_serv:''}]
  }


  getAppointment(db: Knex, hn: any, dateServ: any, seq: any) {
    // return [{date:'',time:'',department:'',detail:''}]
  }

  getVaccine(db: Knex, hn: any) {
    // return [{date_serv:'',time_serv:'',vaccine_code:'',vaccine_name:''}]]
  }

}
