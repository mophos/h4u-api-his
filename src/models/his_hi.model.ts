import Knex = require('knex');
const dbName = process.env.DB_NAME;

// ตัวอย่าง query แบบ knex
// getHospital(db: Knex) {
//   return db('opdconfig as o')
//     .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
// }
// ตัวอย่างการคิวรี่โดยใช้ raw MySqlConnectionConfig
// async getHospital(db: Knex) {
//   let data = await knex.raw(`select * from opdconfig`);
// return data[0];
// }
export class HisHiModel {
    getTableName(knex: Knex) {
        return knex
          .select('TABLE_NAME')
          .from('information_schema.tables')
          .where('TABLE_SCHEMA', '=', dbName);
      }
    
    async getServices(db: Knex, date_serve: any, hn: any) {

        let data = await db.raw(`
        select o.vn as vn, o.vstdttm as date, o.nrxtime as time, c.namecln as department
        FROM ovst as o 
        Inner Join cln as c ON c.cln = o.cln 
        WHERE DATE(o.vstdttm) = '${date_serve}' and o.hn ='${hn}'`);
        return data[0];
    }

    getHospital(db: Knex) {
        return db('setup as s')
            .select('s.hcode as provider_code', 'h.namehosp as provider_name')
            .leftJoin('hospcode as h', 'h.off_id', '=', 's.hcode')
    }

    getAllergyDetail(db: Knex, hn: any) {
        return db('allergy')
            .select('namedrug', 'detail')
            .where('hn', hn);
    }

    getChronic(db: Knex, hn: any) {
        return db('chronic as c')
            .select('c.chronic as icd_code', 'i.name_t as icd_desc', 'c.date_diag as start_date')
            .innerJoin('icd101 as i', 'i.icd10', '=', 'c.chronic')
            .where('c.pid', hn);
    }


    getDiagnosis(db: Knex, vn: any) {
        return db('ovstdx as o')
            .select('o.icd10 as icd_code', 'o.icd10name as icd_desc', 'o.cnt as diage_type')
            .where('vn', vn);
    }

    getRefer(db: Knex, vn: any) {
        return db('orfro as o')
            .select('o.rfrlct as hcode_to', 'h.namehosp as name_to', 'f.namerfrcs as reason')
            .leftJoin('hospcode as h', 'h.off_id', '=', 'o.rfrlct')
            .leftJoin('rfrcs as f', 'f.rfrcs', '=', 'o.rfrcs')
            .where('vn', vn);
    }


    async getDrugs(db: Knex, vn: any) {
        let data = await db.raw(`
        select pd.nameprscdt as drug_name,pd.qty as qty, med.pres_unt as unit ,m.doseprn1 as usage_line1 ,m.doseprn2 as usage_line2,'' as usage_line3
        FROM prsc as p 
        Left Join prscdt as pd ON pd.PRSCNO = p.PRSCNO 
        Left Join medusage as m ON m.dosecode = pd.medusage
        Left Join meditem as med ON med.meditem = pd.meditem
        WHERE p.vn = '${vn}'`);
        return data[0];
    }

    async getLabs(db: Knex, vn: any) {
        let data = await db.raw(`
        SELECT 
        lab_test as lab_name,
        hi.Get_Labresult(t.lab_table,t.labfield,t.lab_number) as lab_result,
        reference as standard_result
        FROM
        (SELECT DISTINCT
        l.ln as lab_number,
        l.vn as seq,
        l.hn as hn,
        lb.fieldname as lab_code_local,
        
        replace(lb.fieldlabel,"'",'\`') as lab_test, lb.filename as lab_table,
        lb.fieldname as labfield,
        concat(lb.normal,' ',lb.unit) as reference,
        replace(lab.labname,"'",'\`') as lab_group_name,
        l.labcode as lab_group
        FROM 
        hi.lbbk as l 
        inner join hi.lab on l.labcode=lab.labcode and l.finish=1 and l.vn='${vn}'
        inner join hi.lablabel as lb on l.labcode = lb.labcode
        group by l.ln,l.labcode,lb.filename,lb.fieldname
        ) as t `);
        return data[0];
    }


    getAppointment(db: Knex, vn: any) {
        return db('oapp as o')
            .select('o.fudate as date', 'o.futime as time', 'o.cln as department', 'o.dscrptn as detail')
            .where('vn', vn);
    }

    async getVaccine(db: Knex, hn: any) {
        let data = await db.raw(`select 
        o.vstdttm as date_serve,
        o.drxtime as time_serve,
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
        o.drxtime as time_serve,
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

}