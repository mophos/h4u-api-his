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
  getHospital(db: Knex, hn: any) {
    // ชื่อสถานพยาบาล
    // return [{provider_code:'',provider_name:''}]
  }

  getProfile(db: Knex, hn: any) {
    // ชื่อ
    // return [{hn:'',cid:'',title_name:'',first_name:'',last_name:''}]
  }

  getAllergyDetail(db: Knex, hn: any) {
    // แพ้ยา
    // return [{drug_name:'',symptom:''}]
  }

  getChronic(db: Knex, hn: any) {
    // แพ้ยา โรคเรื้อรัง
    // return [{icd_code:'',icd_desc:'',start_date:''}]
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{icd_code:'',icd_desc:'',diage_type:''}]
  }

  getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{hcode_to:'',name_to:'',reason:''}]
  }


  getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{drug_name:'',qty:'',unit:'',usage_line1:'',usage_line2:'',usage_line3:''}]
  }

  getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
    // return [{lab_name:'',lab_result:'',standard_result:'',seq:'',time_serv:'',date_serve:''}]
  }


  getAppointment(db: Knex, hn: any, dateServ: any, seq: any) {
    // return [{date:'',time:'',department:'',detail:''}]
  }

  getVaccine(db: Knex, hn: any) {
    // return [{date_serve:'',time_serv:'',vaccine_code:'',vaccine_name:''}]]
  }

}