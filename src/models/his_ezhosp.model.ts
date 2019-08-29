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
            .select('visit.vn as seq', 'visit.date as date_serv',
                'visit.time as time_serv', 'visit.dep_name as department')
            .where('visit.hn', '=', hn)
            .where('visit.date', '=', dateServe);
    }

    getProfile(db: Knex, hn: any) {
        return db('patient')
            .select('hn','no_card as cid', 'title as title_name', 'name as first_name', 'surname as last_name')
            .where('hn', hn);
    }

    getHospital(db: Knex, providerCode: any, hn: any) {
        return db('sys_hospital')
            .select('hcode as provider_code', 'hname as provider_name')
            .limit(1);
    }

    getAllergyDetail(db: Knex, hn: any) {
        return [];
        // return db('allergy')
        //     .select('namedrug', 'detail')
        //     .where('hn', hn);
    }

    async getChronic(db: Knex, hn: any) {
        let data = await db.raw(`select icd.code as 'icd_code',icd.desc as 'icd_name', v.hn,v.vn, dx.lastupdate as 'start_date' from opd_visit as v
        inner join opd_dx as dx on v.vn = dx.vn
        left join lib_icd10 as icd on dx.diag = icd.code
        where hn = ? and exists(select ref from lib_chronic as c where dx.diag between c.icd1 and c.icd2)
        group by dx.diag
        order by dx.vn ASC `,hn);
        return data;
    }


    getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
        return db('view_opd_dx as dx')
            .leftJoin('opd_visit as visit', 'dx.vn', 'visit.vn')
            .select('dx.vn as seq', 'visit.date as date_serv',
                'visit.time as time_serv', 'dx.diag as icd_code',
                'dx.desc as icd_name', 'dx.type as diag_type')
            .where('visit.hn', hn)
            .where('visit.date', dateServe);
    }

    getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
        return db('refer_out as r')
            .leftJoin('lib_hospcode as h', 'r.refer_hcode', 'h.off_id')
            .leftJoin('opd_visit as v', 'r.vn', 'v.vn')
            .select('r.vn as seq', 'v.date as date_serv', 'v.time as time_serv',
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
            .select('drug.vn as seq', 'drug.date as date_serv',
                'drug.time_inp as time_serv', 'drugname as drug_name', 'no as qty', 'unit')
            .select(knex.raw("concat(methodname, ' ', no_use, ' ' , unit_use ) "))
            .select('freqname as usage_line2', 'timesname as usage_line3')
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
            .select('visit.vn as seq', 'visit.date as date_serv',
                'visit.time as time_serv', 'lab_code as lab_test', 'lab.lab_name',
                'lab.result as lab_result')
            .select(db.raw("concat(lab.minresult, ' - ' , lab.maxresult,' ',lab.unit) as standard_result"))
            .where('visit.hn', "=", hn)
            .where('visit.date', "=", dateServe);
    }

    getAppointment(knex: Knex, hn: any, dateServ: any, seq: any) {
        return knex
            .select('opd_fu.hn', 'opd_fu.vn as seq',
                'opd_visit.date as date_serv', 'opd_visit.time as time_serv',
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
        //return [{date_serv:'',time_serv:'',vaccine_code:'',vaccine_name:''}]]
        return [];
    }

    getProcedure(knex: Knex, hn: any, dateServe: any, seq: any) {
        return knex
            .select(
                    'op.hn as pid', 
                    'op.vn as seq', 
                    'visit.date as date_serv',
                    'visit.time as time_serv',
                    'op as procedure_code',
                    'desc as procedure_name', 
                    //'icd_9 as icdcm',
                     'op.dr')
            .select(knex.raw(" visit.date as start_date "))
            .select(knex.raw(" visit.time as start_time "))
            .select(knex.raw(" visit.date as end_date "))
            .select(knex.raw(" visit.time as end_time "))
            .from('view_opd_op as op')
            .leftJoin('opd_visit as visit', 'op.vn', 'visit.vn')
            .where('op.hn', "=", hn);
    }
}