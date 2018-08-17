"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class HisHiModel {
    getHospital(db) {
        return db('setup as s')
            .select('s.hcode as provider_code', 'h.namehosp as provider_name')
            .leftJoin('hospcode as h', 'h.off_id', '=', 's.hcode');
    }
    getAllergyDetail(db, hn) {
        return db('allergy')
            .select('namedrug', 'detail')
            .where('hn', hn);
    }
    getDisease(db, hn) {
        return db('chronic as c')
            .select('c.chronic as icd_code', 'i.name_t as icd_desc', 'c.date_diag as start_date')
            .innerJoin('icd101 as i', 'i.icd10', '=', 'c.chronic')
            .where('c.pid', hn);
    }
    getDiagnosis(db, vn) {
        return db('ovstdx as o')
            .select('o.icd10 as icd_code', 'o.icd10name as icd_desc', 'o.cnt as diage_type')
            .where('vn', vn);
    }
    getRefer(db, vn) {
        return db('orfro as o')
            .select('o.rfrlct as hcode_to', 'h.namehosp as name_to', 'f.namerfrcs as reason')
            .leftJoin('hospcode as h', 'h.off_id', '=', 'o.rfrlct')
            .leftJoin('rfrcs as f', 'f.rfrcs', '=', 'o.rfrcs')
            .where('vn', vn);
    }
    getDrugs(db, vn) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield db.raw(`
        select pd.nameprscdt as drug_name,pd.qty as qty, med.pres_unt as unit ,m.doseprn1 as usage_line1 ,m.doseprn2 as usage_line2,'' as usage_line3
        FROM prsc as p 
        Left Join prscdt as pd ON pd.PRSCNO = p.PRSCNO 
        Left Join medusage as m ON m.dosecode = pd.medusage
        Left Join meditem as med ON med.meditem = pd.meditem
        WHERE p.vn = '${vn}'`);
            return data[0];
        });
    }
    getLabs(db, vn) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield db.raw(`
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
        });
    }
    getAppointment(db, vn) {
        return db('oapp as o')
            .select('o.fudate as date', 'o.futime as time', 'o.cln as department', 'o.dscrptn as detail')
            .where('vn', vn);
    }
    getVaccine(db, hn) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield db.raw(`select 
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
        });
    }
}
exports.HisHiModel = HisHiModel;
//# sourceMappingURL=his_hi.model.js.map