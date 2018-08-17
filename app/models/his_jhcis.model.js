"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbName = process.env.HIS_DB_NAME;
class HisJhcisModel {
    getTableName(knex) {
        return knex
            .select('TABLE_NAME')
            .from('information_schema.tables')
            .where('TABLE_SCHEMA', '=', dbName);
    }
    getHospital(db, hn) {
        return db('person as p')
            .innerJoin('chospital as c', 'p.pcucodeperson', 'c.hoscode')
            .select('c.hoscode as hcode', 'c.hosname as hname')
            .where('p.pid', hn);
    }
    getProfile(db, hn) {
        return db('person as p')
            .select('p.idcard as cid', 'p.pid AS hn', 't.titlename AS title_name', 'p.fname AS first_name', 'p.lname AS last_name', 'p.idcard as cid')
            .innerJoin('ctitle as t', 't.titlecode', 'p.prename')
            .where('p.pid', hn);
    }
    getAllergyDetail(db, hn) {
        return db('person as p1')
            .select(db.raw(`p3.drugname as drug_name,
      (case p2.levelalergic 
      when 1 then "ไม่ร้ายแรง"
      when 2 then "ร้ายแรง เสียชีวิต"
      when 3 then "ร้ายแรง อันตรายถึงชิวิต"
      when 4 then "ร้ายแรง ต้องได้รับการรักษาในโรงพยาบาล"
      when 5 then "ร้ายแรง ทำให้เพิ่มระยะเวลาการรักษานานขึ้น"
      when 6 then "ร้ายแรง (พิการ)"
      when 7 then "ร้ายแรง เป็นเหตุให้เกิดความผิดปกติ แต่กำเนิด"
      when 8 then "ร้ายแรง อื่นๆ "
      else 'n/a' end) as symptom_desc`))
            .joinRaw('inner join personalergic as p2 on p1.pid = p2.pid and p1.pcucodeperson = p2.pcucodeperson')
            .innerJoin('cdrug as p3', 'p2.drugcode', 'p3.drugcode')
            .where('p1.pid', hn);
    }
    getBloodgroup(db, hn) {
        return db('person')
            .select('bloodgroup as blood_group')
            .where('pid', hn);
    }
    getDisease(db, hn) {
        return db('personchronic as pc')
            .select('pc.chroniccode as icd10_code', 'cd.diseasenamethai as icd10_desc')
            .innerJoin('cdisease as cd', 'pc.chroniccode', 'cd.diseasecode')
            .where('pc.pid', hn);
    }
    getServices(db, hn, dateServe) {
        return db('visit as v')
            .select(db.raw(`v.visitdate as date_serve, time_format(v.timestart, '%H:%i') as time_serve, "" as clinic,
          v.visitno as seq, v.weight, v.height, substring_index(v.pressure, '/', 1) as dbp,
          substring_index(v.pressure, '/', -1) as sbp, round(((v.weight) / ((v.height / 100) * (v.height / 100))), 2) as bmi,
          v.vitalcheck as pe, v.refertohos as hcode_to,
          (case v.refer when '00' then "ไม่ใช่ Case Refer"
        when '01' then "เกินขีดความสามารถของหน่วยนี้"
        when '02' then "อาการดีขึ้น จึงส่งไประดับล่าง"
        when '03' then "เป็นความประสงค์ของผู้รับบริการ"
        when '04' then "ส่งไปเพื่อการวินิจฉัยที่ถุกต้อง"
        when '05' then "ส่งไปเพื่อทันตกรรม"
        when '06' then "เพื่อการรักษาต่อเนื่อง"
        when '99' then "อื่นๆ"
    else 'n/a' end) as reason,v.visitno`))
            .where('v.pid', hn)
            .where('v.visitdate', dateServe);
    }
    getServiceDetail(db, visitno) {
        return db('visitdiag as vd')
            .select('vd.diagcode AS icd10_code', 'cd.diseasenamethai AS icd10_desc', 'vd.dxtype AS diag_type')
            .innerJoin('cdisease as cd', 'vd.diagcode', 'cd.diseasecode')
            .where('vd.visitno', visitno);
    }
    getDrugs(db, visitno) {
        return db('visitdrug as vd')
            .select('vd.visitno', 'vd.drugcode', 'd.drugname as drug_name', 'vd.unit as qty', 'd.unitusage as unit', 'vd.dose as usage_line1', db.raw(`'' as usage_line2,'' as usage_line3`))
            .innerJoin('cdrug as d', 'vd.drugcode', 'd.drugcode')
            .where('vd.visitno', visitno);
    }
    getAppointment(db, visitno) {
        return db('visitdiagappoint')
            .select(db.raw(`visitno,appodate as date ,"" as time, appotype ,
    (case appotype when "1" then "รับยาฯ"
    when "2" then "ฟังผล(Follow Up)"
    when "3" then "ทำแผล/ล้างแผล"
    when "4" then "เจาะเลือด(ตรวจโรคฯ)"
    when "5" then "ตรวจน้ำตาล(DTX)"
    when "6" then "วัดความดันฯ"
    when "7" then "แพทย์แผนไทย"
    when "9" then "ทันตกรรม"
    else null end) as detail`))
            .where('visitno', visitno);
    }
    getLab(db, hn, visitno) {
        return db('visitlabchcyhembmsse as v')
            .select(db.raw(`v.labcode,
    c.labname AS lab_name,
    ifnull( v.labresultdigit, v.labresulttext ) AS lab_result,
    NULL AS standard_result`))
            .innerJoin('clabchcyhembmsse as c', 'v.labcode', 'c.labcode')
            .where('v.pid', hn)
            .where('v.visitno', visitno);
    }
    getAnc(db, visitno) {
        return db('visitanc')
            .select(db.raw(`pregage as ga,pregno as anc_no,(case ancres when '1' then "ปกติ" when '2' then "ผิดปกติ" else 'n/a' end) as result`))
            .where('visitno', visitno);
    }
    getVaccineService(db, visitno) {
        return db('visitepi as v')
            .select('v.vaccinecode as vaccine_code', 'd.drugname as vaccine_name')
            .leftJoin('cdrug as d', 'v.vaccinecode', 'd.drugcode')
            .where('visitno', visitno);
    }
    getVaccine(db, hn) {
        return db('visitepi as v')
            .select('v.vaccinecode as vaccine_code', 'd.drugname as vaccine_name', 'v.dateepi as date_serve')
            .leftJoin('cdrug as d', 'v.vaccinecode', 'd.drugcode')
            .where('v.pid', hn);
    }
    getScreening(db, vn) {
        return db('opdscreen as o')
            .select('o.bw as weight', 'o.height', 'o.bpd as dbp', 'o.bps as sbp', 'o.bmi')
            .where('vn', vn);
    }
    getPe(db, vn) {
        return db('opdscreen as s')
            .select('s.pe as PE')
            .where('vn', vn);
    }
    getDiagnosis(db, seq) {
        return db('visitdiag as vd')
            .select('vd.diagcode as icd10_code', 'cd.diseasenamethai as icd10_desc', 'vd.dxtype as diage_type')
            .innerJoin('cdisease as cd', 'vd.diagcode', 'cd.diseasecode')
            .where('vd.visitno', seq);
    }
    getRefer(db, vn) {
        let sql = `SELECT r.refer_hospcode, c.name as refer_cause
        FROM referout r 
        LEFT OUTER JOIN refer_cause c on c.id = r.refer_cause
        WHERE r.vn = ? `;
        return db.raw(sql, [vn]);
    }
    getLabs(db, vn) {
        let sql = `select l.lab_items_name_ref as lab_name,l.lab_order_result as lab_result,
        l.lab_items_normal_value_ref as standard_result
        from lab_order l  
        LEFT OUTER JOIN lab_head h on h.lab_order_number = l.lab_order_number
        where h.vn = ? `;
        return db.raw(sql, [vn]);
    }
}
exports.HisJhcisModel = HisJhcisModel;
//# sourceMappingURL=his_jhcis.model.js.map