"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbName = process.env.HIS_DB_NAME;
class HisJhosModel {
    getHospital(db) {
        return db('opdconfig as o')
            .select('o.hospitalcode as hcode', 'o.hospitalname as hname');
    }
    getPtDetail(db, hn) {
        return db('patient')
            .select('cid', 'pname as title_name', 'fname as first_name', 'lname as last_name')
            .where('hn', hn);
    }
    getAllergyDetail(db, hn) {
        return db('opd_allergy')
            .select('agent as drug_name', 'symptom as symptom_desc')
            .where('hn', hn);
    }
    getBloodgrp(db, hn) {
        return db('patient')
            .select('bloodgrp as blood_group')
            .where('hn', hn);
    }
    getSex(db, hn) {
        return db('patient')
            .select('sex')
            .where('hn', hn);
    }
    getDisease(db, hn) {
        return db('person_chronic as pc')
            .select('pc.icd10 as icd10_code', 'i.name as icd10_desc')
            .leftOuterJoin('patient as pa', 'pa.hn', '=', 'pc.hn')
            .leftOuterJoin('person as pe', 'pe.cid', '=', 'pa.cid')
            .leftOuterJoin('icd101 as i', 'i.code', '=', 'pc.icd10')
            .where('pa.hn', hn);
    }
    getSeq(db, date_serve, hn) {
        let sql = `select o.vn as seq ,o.vstdate as date ,o.vsttime as time,k.department
    from ovst as o
    left outer join kskdepartment as k on k.depcode = o.main_dep 
    where DATE(o.vstdate) = ? and o.hn = ?`;
        return db.raw(sql, [date_serve, hn]);
    }
    getDate(db, vn) {
        return db('ovst as o')
            .select('o.vstdate as date')
            .where('vn', vn);
    }
    getTime(db, vn) {
        return db('ovst as o')
            .select('o.vsttime as time')
            .where('vn', vn);
    }
    getDepartment(db, vn) {
        return db('ovst as o')
            .select('k.department')
            .innerJoin('kskdepartment as k', 'k.depcode', '=', 'o.main_dep')
            .where('vn', vn);
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
    getDiagnosis(db, vn) {
        return db('ovstdiag as o')
            .select('o.icd10 as icd10_code', 'i.name as icd10_desc', 'o.diagtype as diage_type')
            .leftOuterJoin('icd101 as i', 'i.code', '=', 'o.icd10')
            .where('vn', vn);
    }
    getRefer(db, vn) {
        let sql = `SELECT r.refer_hospcode, c.name as refer_cause
    FROM referout r 
    LEFT OUTER JOIN refer_cause c on c.id = r.refer_cause
    WHERE r.vn = ? `;
        return db.raw(sql, [vn]);
    }
    getDrugs(db, vn) {
        let sql = `select s.name as drug_name,o.qty,s.units ,u.name1 as usage_line1,u.name2 as usage_line2,u.name3 as usage_line3  
    from opitemrece o  
    left outer join s_drugitems s on s.icode=o.icode  
    left outer join drugusage u on u.drugusage=o.drugusage  
    where o.drugusage <> '' and o.vn=?
    `;
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
    getAnc(db, vn) {
        let sql = `SELECT a.preg_no as ga, a.current_preg_age as anc_no, s.service_result as result
from person_anc a  
left outer join person p on p.person_id = a.person_id
LEFT OUTER JOIN patient e on e.cid=p.cid
LEFT OUTER JOIN ovst o on o.hn = e.hn
left outer join person_anc_service s on s.person_anc_id=a.person_anc_id
where (a.discharge <> 'Y' or a.discharge IS NULL) 
and o.vn = ? `;
        return db.raw(sql, [vn]);
    }
    getVacine(db, vn) {
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
    getAppointment(db, vn) {
        let sql = `select o.nextdate as date,o.nexttime as time,c.name as department,o.app_cause as detail
    from oapp o  
    left outer join ovst v on o.vn=v.vn  and o.hn = v.hn  
    left outer join clinic c on o.clinic=c.clinic  
    where o.vn = ? `;
        return db.raw(sql, [vn]);
    }
}
exports.HisJhosModel = HisJhosModel;
//# sourceMappingURL=his_jhos.model.js.map