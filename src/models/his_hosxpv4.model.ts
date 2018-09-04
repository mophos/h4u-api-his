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

export class HisHosxpv4Model {

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
    // return [{seq:'',procedure_code:'',procedure_name:'',date_serv:'',time_serv:'',start_date:'',start_time:'',end_date:'',end_time:''}];
    let sql = await db.raw(`
    select ifnull(o.vn,'') as seq
    ,ifnull(o.vstdate,'') as date_serv
    ,ifnull(o.vsttime,'') as time_serv
    ,ifnull(a.op,'') as procedure_code
    ,ifnull(a.cc,'') as procedure_name
    ,ifnull(o.vstdate,'') as start_date
    ,ifnull(SUBSTR(a.t,12,8),'') as start_time
    ,ifnull(o.vstdate,'') as end_date
    ,ifnull(SUBSTR(a.e,12,8),'') as end_time
    
    from (select o.vn,o.vstdate,odx.icd10 op,0 ServicePrice,i9.name as cc,ero.begin_date_time as t,ero.end_date_time as e,'OPD' type
    
    from ovst o
    
    left join ovstdiag odx on odx.vn=o.vn 
    LEFT JOIN er_oper_code er on er.er_oper_code=odx.icd10
    left join icd9cm1 i9 on i9.code=odx.icd10
    LEFT JOIN doctor_operation ero on ero.vn=o.vn
    where o.vn=?
    and odx.icd10 regexp '^[0-9]'
    
    
    
    union
    
    select o.vn,o.vstdate,op.icd9cm,op.price,op.name as cc,er.begin_time as t,er.end_time as e,'ER' type
    
    from ovst o
    
    left join er_regist_oper er on er.vn=o.vn
    
    left join er_oper_code op on er.er_oper_code=op.er_oper_code
    
    where o.vn=er.vn and o.vn=?
    
    and op.icd9cm is not null and op.icd9cm<>''
    
    
    
    union
    
    select o.vn,o.vstdate,h3.icd10tm,h2.service_price,h3.health_med_operation_item_name as cc,h1.service_time as t,h1.service_time as e,'Health' type
    
    from ovst o
    
    left join health_med_service h1 on h1.vn=o.vn
    
    left join health_med_service_operation h2 on h2.health_med_service_id=h1.health_med_service_id
    
    left join health_med_operation_item h3 on h3.health_med_operation_item_id=h2.health_med_operation_item_id
    
    where o.vn=h1.vn and o.vn=?
    
    and h3.icd10tm is not null
    
    
    
    union
    
    select o.vn,o.vstdate,tm.icd10tm_operation_code,tm.opd_price1,tm.name as cc,dt.begin_time as t,dt.end_time as e,'DENT' type
    
    from ovst o
    
    left join dtmain dt on dt.vn=o.vn
    
    left join dttm tm on dt.tmcode=tm.code
    
    where o.vn=dt.vn and o.vn=?
    
    and tm.icd10tm_operation_code is not null) a
    
    
    
    left join ovst o on a.vn=o.vn
    
    left join ovst_seq q on q.vn=o.vn
    
    left join patient pt on pt.hn=o.hn
    
    left join person p on p.patient_hn=pt.hn
    
    left join spclty s on s.spclty=o.spclty
    
    left join doctor d on d.code=o.doctor
    
    
    
    where a.op<>'' and a.op is not null and a.op<>'9990'
    
    
    
    group by a.vn,a.op
    
    
    order by a.vn,procedcode`, [vn, vn, vn, vn]);
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