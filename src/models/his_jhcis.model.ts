import Knex = require('knex');



export class HisJhcisModel {

  getHospital(db: Knex, hn: any) {
    return db('person as p')
      .innerJoin('chospital as c', 'p.pcucodeperson', 'c.hoscode')
      .select('c.hoscode as hcode', 'c.hosname as hname')
      .where('p.pid', hn)
  }

  getProfile(db: Knex, hn: any) {
    return db('person as p')
      .select('p.idcard as cid', 'p.pid AS hn', 't.titlename AS title_name', 'p.fname AS first_name', 'p.lname AS last_name', 'p.idcard as cid')
      .innerJoin('ctitle as t', 't.titlecode', 'p.prename')
      .where('p.pid', hn);
  }

  getAllergyDetail(db: Knex, hn: any) {
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

  getChronic(db: Knex, hn: any) {
    return db('personchronic as pc')
      .select('pc.chroniccode as icd10_code', 'cd.diseasenamethai as icd10_desc')
      .innerJoin('cdisease as cd', 'pc.chroniccode', 'cd.diseasecode')
      .where('pc.pid', hn);
  }

  getBloodgroup(db: Knex, hn: any) {
    return db('person')
      .select('bloodgroup as blood_group')
      .where('pid', hn);
  }

  getDisease(db: Knex, hn: any) {
    return db('personchronic as pc')
      .select('pc.chroniccode as icd10_code', 'cd.diseasenamethai as icd10_desc')
      .innerJoin('cdisease as cd', 'pc.chroniccode', 'cd.diseasecode')
      .where('pc.pid', hn);
  }

  getServices(db: Knex, hn, dateServe) {
    return db('visit as v')
      .select(db.raw(`v.visitdate as date_serv, time_format(v.timestart, '%H:%i') as time_serv, "" as clinic,
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
      .where('v.visitdate', dateServe)
  }

  getServiceDetail(db: Knex, visitno) {
    return db('visitdiag as vd')
      .select('vd.diagcode AS icd10_code', 'cd.diseasenamethai AS icd10_desc', 'vd.dxtype AS diag_type')
      .innerJoin('cdisease as cd', 'vd.diagcode', 'cd.diseasecode')
      .where('vd.visitno', visitno)
  }

  getDrugs(db: Knex, hn: any, dateServe: any, visitno: any) {
    return db('visitdrug as vd')
      .select('vd.visitno', 'vd.drugcode', 'd.drugname as drug_name', 'vd.unit as qty', 'd.unitusage as unit',
        'vd.dose as usage_line1', db.raw(`'' as usage_line2,'' as usage_line3`))
      .innerJoin('cdrug as d', 'vd.drugcode', 'd.drugcode')
      .where('vd.visitno', visitno)
      .whereNot('d.drugtype', '02')
  }

  getAppointment(db: Knex, hn: any, dateServ: any, visitno: any) {
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
      .where('visitno', visitno)
  }

  getLab(db: Knex, hn, visitno) {
    return db('visitlabchcyhembmsse as v')
      .select(db.raw(`v.labcode,
    c.labname AS lab_name,
    ifnull( v.labresultdigit, v.labresulttext ) AS lab_result,
    NULL AS standard_result`))
      .innerJoin('clabchcyhembmsse as c', 'v.labcode', 'c.labcode')
      .where('v.pid', hn)
      .where('v.visitno', visitno)
  }

  getAnc(db: Knex, visitno) {
    return db('visitanc')
      .select(db.raw(`pregage as ga,pregno as anc_no,(case ancres when '1' then "ปกติ" when '2' then "ผิดปกติ" else 'n/a' end) as result`))
      .where('visitno', visitno)
  }


  getVaccineService(db: Knex, visitno) {
    return db('visitepi as v')
      .select('v.vaccinecode as vaccine_code', 'd.drugname as vaccine_name')
      .leftJoin('cdrug as d', 'v.vaccinecode', 'd.drugcode')
      .where('visitno', visitno)
  }

  getVaccine(db: Knex, hn) {
    return db('visitepi as v')
      .select('v.vaccinecode as vaccine_code', 'd.drugname as vaccine_name', 'v.dateepi as date_serv')
      .leftJoin('cdrug as d', 'v.vaccinecode', 'd.drugcode')
      .where('v.pid', hn)
  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`
    select visit.visitno as seq,visit.visitdate as date_serv, visit.timestart as time_serv, drug.drugcode as procedure_code, 
    l.drugname as procedure_name, visit.visitdate as start_date, visit.timestart as start_time, visit.visitdate as end_date, visit.timeend as end_time
    from visitdrug as drug 
    inner join visit on drug.visitno = visit.visitno
    left join cdrug as l on drug.drugcode=l.drugcode
    
    where drug.visitno = '${vn}' and l.drugtype='02'
   `);
    return data[0];
  }








  // //////////////////////////////////////////

  // getSex(db: Knex, hn: any) {
  //   return db('person')
  //     .select(db.raw(`if(sex ==1,"ชาย","หญิง") as sex`))
  //     .where('hn', hn);
  // }

  // getDisease(db: Knex, hn: any) {
  //   return db('personchronic as pc')
  //     .select('pc.chroniccode as ICD10_code', 'cd.diseasenamethai as ICD10_desc')
  //     .innerJoin('cdisease as cd', 'pc.chroniccode', 'cd.diseasecode')
  //     .where('pc.pid', hn);
  // }
  // getSeq(db: Knex, date_serv: any, hn: any) {
  //   return db('visit as v')
  //     .select('v.visitno as seq', 'v.visitdate as date', `'' as department`, db.raw(`time_format(v.timestart,'%H%i') as time`))
  //     .where('v.pid', hn)
  //     .where('v.visitdate', date_serv)
  // }

  getScreening(db: Knex, vn: any) {
    // xxx
    return db('opdscreen as o')
      .select('o.bw as weight', 'o.height', 'o.bpd as dbp', 'o.bps as sbp', 'o.bmi')
      .where('vn', vn);
  }
  getPe(db: Knex, vn: any) {
    return db('opdscreen as s')
      .select('s.pe as PE')
      .where('vn', vn);
  }

  async getDiagnosis(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`
    select dx.pcucode as provider_code, h.hosname as provider_name, dx.visitno as seq, 
    visit.visitdate as date_serv, visit.timestart as time_serv,
    dx.diagcode as icd_code, icd.diseasenamethai as icd_desc, dx.dxtype as diag_type
   from visitdiag as dx
    left join cdisease as icd on dx.diagcode=icd.diseasecode
    left join visit on dx.visitno=visit.visitno
    left join chospital h on dx.pcucode=h.hoscode
   where dx.visitno= '${vn}'
   order by dx.dxtype`);
    return data[0];
  }

  getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    return "";
  }


  // getDrugs(db: Knex, vn: any) {
  //   // let sql = `
  //   // select pd.nameprscdt as drug_name,pd.qty as qty, med.pres_unt as unit ,m.doseprn1 as usage_line1 ,m.doseprn2 as usage_line2,'' as usage_line3
  //   // FROM prsc as p 
  //   // Left Join prscdt as pd ON pd.PRSCNO = p.PRSCNO 
  //   // Left Join medusage as m ON m.dosecode = pd.medusage
  //   // Left Join meditem as med ON med.meditem = pd.meditem
  //   // WHERE p.vn = ?
  //   // `;
  //   let sql = `select s.name as drug_name,o.qty,s.units ,u.name1 as usage_line1,u.name2 as usage_line2,u.name3 as usage_line3  
  //       from opitemrece o  
  //       left outer join s_drugitems s on s.icode=o.icode  
  //       left outer join drugusage u on u.drugusage=o.drugusage  
  //       where o.drugusage <> '' and o.vn=?
  //       `;
  //   return db.raw(sql, [vn]);
  // }

  getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    return "";
  }

  // getAnc(db: Knex, vn: any) {
  //   let sql = `SELECT a.preg_no as ga, a.current_preg_age as anc_no, s.service_result as result
  //   from person_anc a  
  //   left outer join person p on p.person_id = a.person_id
  //   LEFT OUTER JOIN patient e on e.cid=p.cid
  //   LEFT OUTER JOIN ovst o on o.hn = e.hn
  //   left outer join person_anc_service s on s.person_anc_id=a.person_anc_id
  //   where (a.discharge <> 'Y' or a.discharge IS NULL) 
  //   and o.vn = ? `;
  //   return db.raw(sql, [vn]);
  // }

  // getVacine(db: Knex, vn: any) {
  //   let sql = `SELECT v.vaccine_code, v.vaccine_name
  //       FROM person_vaccine_list l 
  //       LEFT OUTER JOIN person p on p.person_id=l.person_id
  //       LEFT OUTER JOIN patient e on e.cid=p.cid
  //       LEFT OUTER JOIN ovst o on o.hn = e.hn
  //       LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
  //       where o.vn = ?
  //       UNION
  //       SELECT v.vaccine_code, v.vaccine_name
  //       FROM ovst_vaccine l 
  //       LEFT OUTER JOIN ovst o on o.vn=l.vn
  //       LEFT OUTER JOIN person_vaccine v on v.person_vaccine_id=l.person_vaccine_id
  //       where o.vn = ? `;
  //   return db.raw(sql, [vn, vn]);
  // }


  // getAppointment(db: Knex, vn: any) {
  //   // return db('oapp as o')
  //   //     .select('o.fudate as date', 'o.futime as time', 'o.cln as department', 'o.dscrptn as detail')
  //   //     .where('vn', vn);

  //   let sql = `select o.nextdate as date,o.nexttime as time,c.name as department,o.app_cause as detail
  //       from oapp o  
  //       left outer join ovst v on o.vn=v.vn  and o.hn = v.hn  
  //       left outer join clinic c on o.clinic=c.clinic  
  //       where o.vn = ? `;
  //   return db.raw(sql, [vn]);
  // }
}
