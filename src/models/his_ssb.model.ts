import Knex = require('knex');
import * as moment from 'moment';
const dbName = process.env.HIS_DB_NAME;

export class HisSsbModel {

  async getHospital(db: Knex, providerCode:any, hn: any) {
    let data = await db.raw(`SELECT CODE as provider_code,right(THAINAME,LEN(THAINAME)-1) as provider_name from SYSCONFIG WHERE CTRLCODE='20010' and CODE='10672'`);
    return data[0];
  }

  async getProfile(db: Knex, hn: any) {
    let data = await db.raw(`SELECT '' as title_name,right(FIRSTname,len(FIRSTname)-1) as first_name,
    right(lastname,len(lastname)-1) as last_name from PATIENT_NAME where HN = '${hn}' and suffix='0'`);
    return data[0];
  }

  async getVaccine(db: Knex, hn: any) {
    let data = await db.raw(`select top 1 '2018-05-05' as date_serv,
    '' as time_serv,
    '' as vaccine_code,'' as vaccine_name 
    from VNMST 
    where VNMST.HN = '${hn}' `);
    return data[0];
  }

  async getChronic(db: Knex, hn: any) {
    let data = await db.raw(`select top 1 '' as icd_code,'' as icd_name,'2018-05-05' as start_date
    from VNMST 
    where VNMST.HN = '${hn}'`);
    return data[0];
  }

  async getAllergyDetail(db: Knex, hn: any) {
    let data = await db.raw(`select SUBSTRING(STOCK_MASTER.ENGLISHNAME,2,LEN(STOCK_MASTER.ENGLISHNAME)) as drug_name,
    SUBSTRING(SYSCONFIG.THAINAME,2,LEN(SYSCONFIG.THAINAME)) as symptom
    from PATIENT_ALLERGIC
    inner join STOCK_MASTER on PATIENT_ALLERGIC.MEDICINE = STOCK_MASTER.STOCKCODE
    inner join SYSCONFIG on PATIENT_ALLERGIC.ADVERSEREACTIONS1 = SYSCONFIG.CODE and SYSCONFIG.CTRLCODE = '20028'
    where HN='${hn}'`);
    return data[0];
  }

  async getServices(db: Knex, hn: any, dateServe: any) {
    let data = await db.raw(`select VNMST.hn+''+ VNMST.VN as seq,
    convert(varchar,YEAR(VNPRES.REGINDATETIME)) + '-' + 
    convert(varchar,MONTH(VNPRES.REGINDATETIME)) + '-' + 
    convert(varchar,DAY(VNPRES.REGINDATETIME)) as date_serv,
    convert(varchar,VNPRES.REGINDATETIME,108) as time_serv,VNPRES.CLINIC as department
    from VNPRES 
    inner join VNMST on VNPRES.VISITDATE = VNMST.VISITDATE and VNPRES.VN = VNMST.VN
    where VNMST.HN = '${hn}' and VNMST.VISITDATE = '${dateServe}'`);
    return data[0];
  }

  async getDiagnosis(db: Knex, hn: any, dateServe: any) {
    let data = await db.raw(`select VNMST.hn+''+ VNMST.VN as seq,
    convert(varchar,YEAR(VNDIAG.DIAGDATETIME)) + '-' + 
    convert(varchar,MONTH(VNDIAG.DIAGDATETIME)) + '-' + 
    convert(varchar,DAY(VNDIAG.DIAGDATETIME)) as date_serv,
    convert(varchar,VNDIAG.DIAGDATETIME,108) as time_serv,
    VNDIAG.ICDCODE as icd_code,ICD_MASTER.ENGLISHNAME as icd_name,
    case when VNDIAG.TYPEOFTHISDIAG = '1' then 'Primary'
    when VNDIAG.TYPEOFTHISDIAG = '2' then 'Complication'
    when VNDIAG.TYPEOFTHISDIAG = '3' then 'Other'
    when VNDIAG.TYPEOFTHISDIAG = '4' then 'Comorbidity'
    else '' end as diag_type
    from VNDIAG 
    inner join VNMST on VNDIAG.VISITDATE = VNMST.VISITDATE and VNDIAG.VN = VNMST.VN
    inner join ICD_MASTER on VNDIAG.ICDCODE = ICD_MASTER.ICDCODE
    where VNMST.hn = '${hn}' and VNMST.VISITDATE = '${dateServe}'`);
    return data[0];
  }

  async getRefer(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`select top 1 ''  as seq,'${dateServe}' as date_serv,'' as time_serv,'' as to_provider_code,'' as to_provider_name,'' as reason,
    '' as start_date from VNMST 
    where VNMST.HN = '${hn}' and VNMST.VISITDATE = '${dateServe}'`);
    return data[0];

  }

  async getProcedure(db: Knex, hn: any, dateServe: any, vn:any) {
    let data = await db.raw(`select top 1 '' as seq ,
    '' as date_serv, '' as time_serv,'' as procedure_code,'' as icd_name,
    '' as start_date,'' as end_date
    from VNMST 
    where VNMST.HN = '${hn}' and VNMST.VISITDATE = '${dateServe}'`);
    return data[0];
  }

  async getDrugs(db: Knex, hn: any, dateServe: any) {
    let data = await db.raw(`SELECT VNMST.hn+''+ VNMST.VN as seq,
    convert(varchar,YEAR(VNMEDICINE.makedatetime)) + '-' + 
    convert(varchar,MONTH(VNMEDICINE.makedatetime)) + '-' + 
    convert(varchar,DAY(VNMEDICINE.makedatetime)) as date_serv,
    convert(varchar,VNMEDICINE.makedatetime,108) as time_serv,
    ISNULL(SUBSTRING(STOCK_MASTER.ENGLISHNAME,2,LEN(STOCK_MASTER.ENGLISHNAME)),
    SUBSTRING(STOCK_MASTER.THAINAME,2,LEN(STOCK_MASTER.THAINAME))) as drug_name,
    VNMEDICINE.QTY as qty,
    VNMEDICINE.UNITCODE,
    SUBSTRING(sysqty.THAINAME,2,LEN(sysqty.THAINAME)) as unit,
    case when VNMEDICINE.DOSETYPE IS NULL THEN
    VNMEDICINE.DOSEMEMO
    ELSE
    SUBSTRING(sysdosetype.THAINAME,2,LEN(sysdosetype.THAINAME)) + ' ' +
    SUBSTRING(sysdoseqty.THAINAME,2,LEN(sysdoseqty.THAINAME)) + ' ' +
    SUBSTRING(sysqty.THAINAME,2,LEN(sysqty.THAINAME)) END AS usage_line1,
    SUBSTRING(sysdose.THAINAME,2,LEN(sysdose.THAINAME)) AS usage_line2,
    SUBSTRING(sysaux.THAINAME,2,LEN(sysaux.THAINAME)) AS usage_line3
    from VNMEDICINE 
    inner join STOCK_MASTER on VNMEDICINE.stockcode = STOCK_MASTER.STOCKCODE
    inner join VNMST on VNMEDICINE.VISITDATE = VNMST.VISITDATE and VNMEDICINE.VN = VNMST.VN
    inner join SYSCONFIG sysqty on VNMEDICINE.UNITCODE = sysqty.CODE and sysqty.CTRLCODE = '20034'
    left outer join SYSCONFIG sysdosetype on VNMEDICINE.DOSETYPE = sysdosetype.CODE and sysdosetype.CTRLCODE = '20031'
    left outer join SYSCONFIG sysdoseqty on VNMEDICINE.DOSEQTYCODE = sysdoseqty.CODE and sysdoseqty.CTRLCODE = '20033'
    left outer join SYSCONFIG sysdose on VNMEDICINE.DOSECODE = sysdose.CODE and sysdose.CTRLCODE = '20032'
    left outer join SYSCONFIG sysaux on VNMEDICINE.AUXLABEL1 = sysaux.CODE and sysaux.CTRLCODE = '20030'
    where LEN(VNMEDICINE.STOCKCODE) >5 and VNMST.HN = '${hn}' and VNMST.VISITDATE  = '${dateServe}'`);
    return data[0];
  }

  async getLabs(db: Knex, hn: any, dateServe: any, vn: any) {
    let data = await db.raw(`SELECT ROW_NUMBER() OVER(ORDER BY LABRESULT.RESULTDATETIME) as seq,
    convert(varchar,YEAR(LABRESULT.RESULTDATETIME)) + '-' + 
    convert(varchar,MONTH(LABRESULT.RESULTDATETIME)) + '-' + 
    convert(varchar,DAY(LABRESULT.RESULTDATETIME)) as date_serv,
    convert(varchar,LABRESULT.RESULTDATETIME,108) as time_serv,
    SUBSTRING(SYSCONFIG.THAINAME,2,LEN(SYSCONFIG.THAINAME)) as lab_name,
    RESULTVALUE as lab_result,
    NORMALRESULTVALUE as standard_result
    from LABRESULT
    inner join SYSCONFIG on LABRESULT.LABCODE = SYSCONFIG.CODE and SYSCONFIG.CTRLCODE = '20067'
    where HN = '${hn}' and convert(date,convert(char,LABRESULT.RESULTDATETIME)) = '${dateServe}'
    AND RESULTDATETIME IS NOT NULL`);
    return data[0];
  }

  async getAppointment(db: Knex, hn: any, dateServe: any) {
    let data = await db.raw(`select ROW_NUMBER() OVER(ORDER BY MAKEDATETIME) as seq,
    convert(varchar,YEAR(HNAPPMNT.MAKEDATETIME)) + '-' + 
    convert(varchar,MONTH(HNAPPMNT.MAKEDATETIME)) + '-' + 
    convert(varchar,DAY(HNAPPMNT.MAKEDATETIME)) as date_serv,
    convert(varchar,HNAPPMNT.MAKEDATETIME,108) as time_serv,
    substring(SYSCONFIG.THAINAME,2,len(SYSCONFIG.THAINAME)) as clinic,
    convert(varchar,YEAR(HNAPPMNT.APPOINTMENTDATETIME)) + '-' + 
    convert(varchar,MONTH(HNAPPMNT.APPOINTMENTDATETIME)) + '-' + 
    convert(varchar,DAY(HNAPPMNT.APPOINTMENTDATETIME)) as appoint_date,
    convert(varchar,HNAPPMNT.APPOINTMENTDATETIME,108) as appoint_time,
    SUBSTRING(PROCE.THAINAME,2,LEN(PROCE.THAINAME)) as detail
    
    from HNAPPMNT
    inner join SYSCONFIG on HNAPPMNT.APPOINTMENTWITHCLINIC = SYSCONFIG.CODE and SYSCONFIG.CTRLCODE = '20016'
    inner join SYSCONFIG PROCE on HNAPPMNT.PROCEDURECODE = PROCE.CODE and PROCE.CTRLCODE = '20109'

    where hn = '${hn}'`);
    return data[0];
  }
}
