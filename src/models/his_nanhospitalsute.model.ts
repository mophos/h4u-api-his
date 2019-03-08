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

export class HisNanhospModel {

  getHospital(db: Knex, providerCode: any, hn: any) {
    return db('hisconfig')
      .select('hospcode as provider_code', 'hospname as provider_name')
  }

  getProfile(db: Knex, hn: any) {
    return db('patient')
      .select('hn', 'person_code as cid', 'prefix as title_name', 'name as first_name', 'sur_name as last_name')
      .where('hn', hn)
  }

  async getServices(db: Knex, hn: any, dateServe: any) {
    let sql = await db.raw(`SELECT code_visit as seq,date(day_arr) as date_serv,time as time_serv
    from visit WHERE hn = ? and day_arr = date_format(?,'%Y%m%d')
    `, [hn, dateServe]);
    return sql[0];
  }

  getAllergyDetail(db: Knex, hn: any) {
    return db('adr as d')
      .select('IFNULL(i.drugthai,i.drugname) as drug_name', 'd.remark as symptom')
      .join('inventory_ipd as i', 'd.drugcode', 'i.drugcode')
      .where('d.hn', hn).andWhere(db.raw('d.orduse<>"ยกเลิก"'));
  }

  getChronic(db: Knex, hn: any) {
    return db('tb_register_dx')
      .select('date(date_diag) as start_date', 'icd10 as icd_code', 'diag_name as icd_name')
      .where('hn', hn);
  }

  getDiagnosis(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('visit as v')
      .select('v.code_visit as seq', 'date(v.day_arr) as date_serv',
        'v.time as time_serv', 'd.diag as icd_code', 'i.name_tm as icd_name', 't.name as diag_type')
      .join('ODXyymm_n as d', 'v.code_visit', '=', 'd.visit_code')
      .join('icd10_tm as i', 'd.diag', '=', 'i.icd10_tm')
      .join('diagtype as t', 'd.dxtype', 't.id')
      .where('v.code_visit', vn);
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`SELECT p.visit_code as seq,p.drugcode as procedure_code,p.drugname as procedure_name,p.date as date_serv,
    time(p.order_time) as time_serv,p.date as start_date,time(p.order_time) as start_time,p.date as end_date,
    time(p.order_time) as end_time
    FROM prsclist_opd as p
    LEFT JOIN inventory_ipd as i ON(p.drugcode=i.drugcode)
    #LEFT JOIN visit as v ON()
    WHERE p.visit_code = ? AND p.grouptype NOT LIKE 'ZZZ%'
    `, [vn]);
    return data[0];
  }

  getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    return db('ORFyymm as r')
      .select('r.visit_code as seq', 'date(v.day_arr) as date_serv',
        'time(v.time) as time_serv', 'r.refer as to_provider_code', 'concat(h.off_name2,h.off_name1) as to_provider_name',
        'r.estimation as refer_cause')
      .innerJoin('hospcode as h', 'r.refer', 'h.off_id')
      .innerJoin('visit as v', 'r.visit_code', 'v.code_visit')
      .where('r.visit_code', vn).andWhere('r.refertype', '2');
  }

  async getDrugs(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`SELECT p.visit_code as seq,p.drugcode as procedure_code,p.drugname as procedure_name,p.date as date_serv,
    time(p.order_time) as time_serv,p.date as start_date,time(p.order_time) as start_time,p.date as end_date,
    time(p.order_time) as end_time
    FROM prsclist_opd as p
    LEFT JOIN inventory_ipd as i ON(p.drugcode=i.drugcode)
    #LEFT JOIN visit as v ON()
    WHERE p.visit_code = ? AND p.grouptype LIKE 'ZZZ%'
    `, [vn]);
    return data[0];
  }

  async getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`SELECT a.day_ord as date_serv,a.time_rep as time_serv,a.code_visit as seq,
    c.lab_name as lab_name,c.result as lab_result,c.note as standard_result
    FROM orde_lab a INNER JOIN lab_list b ON(a.code_lab = b.code_inv)
    LEFT JOIN
    (
    SELECT l1.orde_code,l2.word_1 as lab_name,l1.value_1 as result,l3.normal_1 as note, 1 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_1<>'' UNION ALL

    SELECT l1.orde_code,l2.word_2 as lab_name,l1.value_2 as result,l3.normal_2 as note, 2 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_2<>'' UNION ALL

    SELECT l1.orde_code,l2.word_3 as lab_name,l1.value_3 as result,l3.normal_3 as note, 3 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_3<>'' UNION ALL

    SELECT l1.orde_code,l2.word_4 as lab_name,l1.value_4 as result,l3.normal_4 as note, 4 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_4<>'' UNION ALL

    SELECT l1.orde_code,l2.word_5 as lab_name,l1.value_5 as result,l3.normal_5 as note, 5 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_5<>'' UNION ALL

    SELECT l1.orde_code,l2.word_6 as lab_name,l1.value_6 as result,l3.normal_6 as note, 6 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_6<>'' UNION ALL

    SELECT l1.orde_code,l2.word_7 as lab_name,l1.value_7 as result,l3.normal_7 as note, 7 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_7<>'' UNION ALL

    SELECT l1.orde_code,l2.word_8 as lab_name,l1.value_8 as result,l3.normal_8 as note, 8 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_8<>'' UNION ALL

    SELECT l1.orde_code,l2.word_9 as lab_name,l1.value_9 as result,l3.normal_9 as note, 9 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_9<>'' UNION ALL

    SELECT l1.orde_code,l2.word_10 as lab_name,l1.value_10 as result,l3.normal_10 as note, 10 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_10<>'' UNION ALL

    SELECT l1.orde_code,l2.word_11 as lab_name,l1.value_11 as result,l3.normal_11 as note, 11 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_11<>'' UNION ALL

    SELECT l1.orde_code,l2.word_12 as lab_name,l1.value_12 as result,l3.normal_12 as note, 12 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_12<>'' UNION ALL

    SELECT l1.orde_code,l2.word_13 as lab_name,l1.value_13 as result,l3.normal_13 as note, 13 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_13<>'' UNION ALL

    SELECT l1.orde_code,l2.word_14 as lab_name,l1.value_14 as result,l3.normal_14 as note, 14 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_14<>'' UNION ALL

    SELECT l1.orde_code,l2.word_15 as lab_name,l1.value_15 as result,l3.normal_15 as note, 15 as labno
    FROM orde_lab a INNER JOIN lab_out as l1 ON(a.code_ord=l1.orde_code) INNER JOIN lab_template as l2 ON(l1.code_inv=l2.code_inv) INNER JOIN lab_normal as l3 ON(l1.code_inv=l3.code_inv) WHERE a.code_visit=? AND l1.value_15<>''
    ) as c ON(a.code_ord=c.orde_code)
    LEFT JOIN
    (
    SELECT a.code_ord,b.memo_text,b.reported,b.approved FROM orde_lab as a
    INNER JOIN lab_out_memo as b ON(a.code_ord=b.orde_code)
    WHERE a.code_visit=?
    GROUP BY a.code_ord
    ) as d ON(a.code_ord=d.code_ord)
    WHERE a.code_visit=? AND (c.result<>'' OR d.memo_text<>'')

    ORDER BY a.code_ord,c.labno
    `, [vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn, vn]);
    return data[0];
  }

  getVaccine(db: Knex, hn: any) {
    return db('pcc_epi as e')
      .select('e.vcdate as date_serv', 'null as time_serv', 'e.vcode as vaccine_code', '.protect as vaccine_name')
      .innerJoin('pcc_vaccine as v', 'e.vcode', 'v.id')
      .where('e.hn', hn)
  }

  getAppointment(db: Knex, hn: any, dateServ: any, vn: any) {
    return db('opd_book as b')
      .select('b.book_visit as seq', 'b.input_date as date_serv', 'b.input_time as time_serv',
        'c.name as department', 'b.book_date as date', 'b.book_time as time', 'null as detail')
      .join('service_code as s', 'b.book_serv', 's.code_serv')
      .where('b.book_visit', vn);
  }

}
