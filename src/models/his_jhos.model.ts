import Knex = require('knex');

export class HisJhosModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db('opdconfig as o')
      .select('o.hospitalcode as provider_code', 'o.hospitalname as provider_name')
  }

  getProfile(db: Knex, hn: any) {
    return db('patient')
      .select('cid', 'prename as title_name', 'fname as first_name', 'lname as last_name')
      .where('hn', hn);
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('opd_allergy')
      .select('agent as drug_name', 'symptom as symptom')
      .where('hn', hn);
  }

  getServices(db: Knex, hn: any, dateServe: any) {
    let sql = `select o.vn as seq ,o.vstdate as date_serve ,o.vsttime as time_serv
    from ovst as o
    left outer join kskdepartment as k on k.depcode = o.main_dep 
    where DATE(o.vstdate) = ? and o.hn = ?`;
    return db.raw(sql, [dateServe, hn]);
  }


  getDiagnosis(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('ovstdiag as o')
      .select('o.icd10 as icd_code', 'i.name as icd_name', 'o.diagtype as diag_type')
      .leftOuterJoin('icd101 as i', 'i.code', '=', 'o.icd10')
      .where('vn', vn);
  }

  getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = `SELECT r.refer_hospcode as, c.name as refer_cause
    FROM referout r 
    LEFT OUTER JOIN refer_cause c on c.id = r.refer_cause
    WHERE r.vn = ? `;
    return db.raw(sql, [vn]);
  }


  getDrugs(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = `select s.name as drug_name,o.qty,s.units ,u.name1 as usage_line1,u.name2 as usage_line2,u.name3 as usage_line3  
    from opitemrece o  
    left outer join s_drugitems s on s.icode=o.icode  
    left outer join drugusage u on u.drugusage=o.drugusage  
    where o.drugusage <> '' and o.vn=?
    `;
    return db.raw(sql, [vn]);
  }

  getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    let sql = `select l.lab_items_name_ref as lab_name,l.lab_order_result as lab_result,
    l.lab_items_normal_value_ref as standard_result
    from lab_order l  
    LEFT OUTER JOIN lab_head h on h.lab_order_number = l.lab_order_number
    where h.vn = ? `;
    return db.raw(sql, [vn]);
  }



  getVaccine(db: Knex, vn: any) {
    let sql = `SELECT v.vaccine_code, v.vaccine_name
    FROM person_vaccine_list l 
    LEFT OUTER JOIN person p on p.person_id=l.person_id
    LEFT OUTER JOIN patient e on e.cid=p.cid
    LEFT OUTER JOIN ovst o on o.hn = e.hn
    LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
    where o.vn = ?
    UNION
    SELECT v.vaccine_code, v.vaccine_name
    FROM ovst_vaccine l 
    LEFT OUTER JOIN ovst o on o.vn=l.vn
    LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
    where o.vn = ? `;
    return db.raw(sql, [vn, vn]);
  }


  getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    let sql = `select o.nextdate as date,o.nexttime as time,c.name as department,o.app_cause as detail
    from oapp o  
    left outer join ovst v on o.vn=v.vn  and o.hn = v.hn  
    left outer join clinic c on o.clinic=c.clinic  
    where o.vn = ? `;
    return db.raw(sql, [vn]);
  }
}