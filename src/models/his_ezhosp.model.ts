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
export class HisEzhospModel {

    async getServices(db: Knex, hn: any, dateServe: any) {
        return db('view_opd_visit as visit')
            .select('visit.vn as seq', 'visit.date as date_serve',
                'visit.time as time_serv', 'visit.dep_name as department')
            .where('visit.hn', '=', hn)
            .where('visit.date', '=', dateServe);
    }

    getHospital(db: Knex, hn: any) {
        return db('sys_hospital')
            .select('hcode as provider_code', 'hname as provider_name')
            .limit(1);
    }

    getAllergyDetail(db: Knex, hn: any) {
        return db('allergy')
            .select('namedrug', 'detail')
            .where('hn', hn);
    }

    getChronic(db: Knex, hn: any) {
        return db('chronic as c')
            .select('c.chronic as icd_code', 'i.name_t as icd_name', 'c.date_diag as start_date')
            .innerJoin('icd101 as i', 'i.icd10', '=', 'c.chronic')
            .where('c.pid', hn);
    }


    getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
        return db('view_opd_dx a dx')
            .leftJoin('opd_visit as visit', 'dx.vn', 'visit.vn')
            .select('dx.vn as seq', 'visit.date as date_serve',
                'visit.time as time_serv', 'dx.diag as icd_code',
                'dx.desc as icd_name', 'dx.type as diag_type')
            .where('visit.hn', hn)
            .where('visit.date', dateServe);
    }

    getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
        return db('refer_out as r')
            .leftJoin('lib_hospcode as h', 'r.refer_hcode', 'h.off_id')
            .leftJoin('opd_visit as v', 'r.vn', 'v.vn')
            .select('r.vn as seq', 'v.date as date_serve', 'v.time as time_serv',
                'r.refer_hcode as hcode_to',
                'h.name as name_to',
                'r.refer_hcode as depto_provider_codeartment',
                'h.name as to_provider_name',
                'r.cause5_name AS refer_cause',
                'r.cause5_name AS reason')
            .where('v.hn', hn)
            .where('r.vn', seq);
    }


    getDrugs(knex: Knex, hn: any, dateServe: any, seq: any) {
        return knex
            .select('drug.vn as seq', 'drug.date as date_serve',
                'drug.time_inp as time_serv', 'drugname as drug_name', 'no as qty', 'unit')
            .select(knex.raw("concat(method_name, ' ', no_use, ' ' , unit_use ) "))
            .select('freq_name as usage_line2', 'times_name as usage_line3')
            .from('view_pharmacy_opd_drug as drug')
            .where('hn', "=", hn)
            .where('date', "=", dateServe)
            .where('no', '>', 0)
            .where('price', '>', 0);
    }

    getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
        return db
            .from('view_lab_result as lab')
            .leftJoin('opd_visit as visit', 'lab.vn', 'visit.vn')
            .select('visit.vn as seq', 'visit.date as date_serve',
                'visit.time as time_serv', 'lab_code as lab_test', 'lab.lab_name',
                'lab.result as lab_result')
            .select(db.raw("concat(lab.minresult), ' - ' , lab.maxresult,' ',lab.unit) as standard_result"))
            .where('visit.hn', "=", hn)
            .where('visit.date', "=", dateServe);
    }

    getAppointment(knex: Knex, hn: any, dateServ: any, seq: any) {
        return knex
            .select('opd_fu.hn', 'opd_fu.vn as seq',
                'opd_visit.date as date_serve', 'opd_visit.time as time_serv',
                'opd_fu.date as date_input', 'opd_fu.fu_date as date',
                'opd_fu.fu_time as time',
                'opd_visit.dep as local_code',
                'lib_clinic.standard as clinic_code',
                'lib_clinic.clinic as department',
                'opd_fu.detail')
            .from('opd_fu')
            .leftJoin('opd_visit', 'opd_fu.vn', 'opd_visit.vn')
            .leftJoin('lib_clinic', 'opd_visit.dep', 'lib_clinic.code')
            .where('opd_visit.hn', "=", hn)
            .where('opd_visit.date', "=", dateServ);
    }

    async getVaccine(db: Knex, hn: any) {
        let data = await db.raw(`select 
        o.vstdttm as date_serve,
        DATE_FORMAT(time(o.drxtime),'%h:%i:%s') as time_serv, 
        cv.NEW as vaccine_code, 
        h.namehpt as vaccine_name
        from 
        hi.epi e 
        inner join 
        hi.ovst o on e.vn = o.vn 
        inner join 
        hi.cvt_vacc cv on e.vac = cv.OLD  
        left join 
        hi.hpt as h on e.vac=h.codehpt
        where 
        o.hn='${hn}'
        
        UNION

        select 
        o.vstdttm as date_serve,
        DATE_FORMAT(time(o.drxtime),'%h:%i:%s') as time_serv, 
        vc.stdcode as vacine_code, 
        vc.\`name\` as vacine_name
        from 
        hi.ovst o 
        inner join 
        hi.prsc pc on o.vn = pc.vn  
        inner join 
        hi.prscdt pd on pc.prscno = pd.prscno  
        inner join 
        hi.meditem m on pd.meditem = m.meditem 
        inner join 
        hi.vaccine vc on vc.meditem = m.meditem  
        where 
        o.hn='${hn}'`);
        return data[0];
    }

    getProcedure(knex: Knex, hn: any, dateServe: any, seq: any) {
        return knex
            .select('op.vn as visitno', 'visit.date as date_serv',
                'visit.time as time_serv',
                'hn as pid', 'op as procedcode',
                'desc as procedname', 'icd_9 as icdcm', 'dr')
            .select(knex.raw(" '' as start_date "))
            .select(knex.raw(" '' as start_time "))
            .from('view_opd_op as op')
            .leftJoin('opd_visit as visit', 'op.vn', 'opd_visit.vn')
            .where('hn', "=", hn);
    }
}