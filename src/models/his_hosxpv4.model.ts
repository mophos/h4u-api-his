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

export class HisHosxpv3Model {

  getHospital(db: Knex, hn: any) {
    return db('opdconfig as o')
      .select('o.hospitalcode as provider_code', 'o.hospitalname as provider_name')
  }

  getProfile(db: Knex, hn: any) {
    return db('patient')
      .select('hn', 'cid', 'pname as title_name', 'fname as first_name', 'lname as last_name')
      .where('hn', hn)
  }

  async getServices(db: Knex, hn: any, dateServe: any) {
    let sql = await db.raw(`SELECT vn as seq,DATE_FORMAT(vstdate, '%Y-%m-%d') as date_serv,vsttime as time_serv
    from ovst WHERE hn = ? and vstdate = ?
    `, [hn, dateServe]);
    return sql[0];
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('opd_allergy')
      .select('agent as drug_name', 'symptom')
      .where('hn', hn);
  }


  async getChronic(db: Knex, hn: any) {
    let sql = await db.raw(`select c.icd10 as icd_code,c.name as icd_name,cm.regdate as start_date
    FROM clinicmember cm
    LEFT OUTER JOIN clinic c on c.clinic=cm.clinic where cm.hn = ?`, hn);
    return sql[0];
  }


  async getDiagnosis(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(`select ov.vn as seq,ov.vstdate as date_serv,ov.vsttime as time_serv,ov.icd10 as icd_code,i.name as icd_name,ov.diagtype as diag_type
    FROM ovstdiag ov
    LEFT OUTER JOIN icd101 i on i.code=ov.icd10
    where ov.vn = ?`, vn);
    return sql[0];
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(``);
    return null;
  }

  async getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(`SELECT ro.vn as seq,ov.vstdate as date_serv,ov.vsttime as time_serv,
    ro.refer_hospcode as to_provider_code,h.name as to_provider_name,rf.name as reason,ro.refer_date as start_date
    FROM referout ro
    LEFT OUTER JOIN rfrcs rf on rf.rfrcs=ro.rfrcs
    LEFT OUTER JOIN hospcode h on h.hospcode=ro.refer_hospcode
    LEFT OUTER JOIN ovst ov on ov.vn=ro.vn
    where ro.vn=?`, vn);
    return sql[0];
  }

  async getDrugs(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(`SELECT o.vn,d.name as drug_name,oi.qty,d.units as unit,dd.name1 as usage_line1,dd.name2 as usage_line2,dd.name3 asusage_line3
    from ovst o
    INNER JOIN opitemrece oi on oi.vn = o.vn
    INNER JOIN drugitems d on d.icode = oi.icode
    INNER JOIN drugusage dd on dd.drugusage = oi.drugusage
    WHERE o.vn = ?`, vn);
    return sql[0];
  }

  async getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = await db.raw(`SELECT lh.vn as seq,lh.order_date as date_serv,
    lh.order_time as time_serv,lo.lab_items_name_ref as lab_name,lo.lab_order_result as lab_result,
    lo.lab_items_normal_value_ref as standard_result
    FROM lab_head lh
    LEFT OUTER JOIN lab_order lo on lo.lab_order_number=lh.lab_order_number
    where lh.vn = ?`, vn);
    return sql[0];
  }

  async getVaccine(db: Knex, hn: any) {
    let sql = await db.raw(`select o.vstdate as date_serv, o.vsttime as time_serv, pv.vaccine_code , pv.vaccine_name
      FROM ovst_vaccine ov
          LEFT OUTER JOIN person_vaccine pv on pv.person_vaccine_id=ov.person_vaccine_id
          LEFT OUTER JOIN ovst o on o.vn=ov.vn
      where o.hn = ?`, hn);
    return sql[0];
  }

  async getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    let sql = await db.raw(`SELECT oa.vn as seq,oa.clinic as department,oa.vstdate as date_serv,
      oa.entry_time as time_serv,oa.nextdate as date,oa.nexttime as time,oa.note as detail
      FROM oapp oa where o.vn = ?`, vn);
    return sql[0];
  }
}