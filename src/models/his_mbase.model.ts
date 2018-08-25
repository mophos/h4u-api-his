import Knex = require('knex');
// ตัวอย่าง query แบบ เknex
// getHospital(db: Knex,hn:any) {
//   return db('opdconfig as o')
//     .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
// }
// ตัวอย่างการคิวรี่โดยใช้ raw MySqlConnectionConfig
// async getHospital(db: Knex,hn:any) {
//   let data = await knex.raw(`select * from opdconfig`);
// return data[0];
// }
export class HisMbaseModel {
  async getHospital(db: Knex, hn: any) {
    let data = await db.raw(`
    SELECT
    a.offid as hcode, b.HOSP_NAME as hname
    FROM gcoffice a , hospitals b
    WHERE a.offid = b.HOSP_ID `);
    return data[0];
  }

  async getServices(db: Knex, date_serve: any, hn: any) {

    let data = await db.raw(`
    SELECT a.VISIT_ID as seq, DATE(a.REG_DATETIME) as date, TIME(a.REG_DATETIME)as time,
      b.UNIT_NAME as department
      FROM opd_visits a 
      INNER JOIN service_units b ON a.UNIT_REG = b.UNIT_ID
      WHERE a.is_cancel = 0
      AND DATE(a.REG_DATETIME) = '${date_serve}' AND a.HN ='${hn}'`);
    return data[0];
  }


  async getAllergyDetail(db: Knex, hn: any) {
    let data = await db.raw(`
    SELECT 
      b.DRUG_NAME AS drug_name,
      a.ALLERGY_NOTE AS symptom
    FROM
      cid_drug_allergy a
    INNER JOIN drugs b ON a.DRUG_ID = b.DRUG_ID
    LEFT JOIN cid_hn c ON a.CID = c.CID
    WHERE c.HN = '${hn}'`);
    return data[0];
  }

  async getChronic(db: Knex, hn: any) {
    let data = await db.raw(`
        SELECT
        a.ICD10 AS icd_code,
        CASE
      WHEN a.ICD10 BETWEEN 'E10'
      AND 'E14' THEN
        'โรคเบาหวาน'
      WHEN a.ICD10 BETWEEN 'I10'
      AND 'I15' THEN
        'โรคความดันโลหิตสูง'
      WHEN a.ICD10 BETWEEN 'I20'
      AND 'I25' THEN
        'โรคหัวใจขาดเลือด'
      WHEN a.ICD10 BETWEEN 'I60'
      AND 'I64' THEN
        'โรคหลอดเลือดสมอง'
      WHEN a.ICD10 BETWEEN 'J41'
      AND 'J45' THEN
        'โรคเรื้อรังทางเดินหายใจส่วนล่าง'
      WHEN a.ICD10 = 'N18' THEN
        'โรคไตเรื้อรัง'
      ELSE
        'ไม่ระบุ'
      END AS icd_name,
      a.DX_DATE AS start_date
      FROM
        chronic_reg a
      LEFT JOIN cid_hn b ON a.CID = b.CID
      WHERE
        a.DSC_DATE = 0
      AND a.IS_CANCEL = 0
      AND a.DX_DATE <> 0
      AND b.HN = '${hn}'`);
    return data[0];
  }


  async getDiagnosis(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT 
    a.VISIT_ID as seq,
    date(a.REG_DATETIME) as date_serv,
    time(a.REG_DATETIME) as time_serv,
    c.ICD10_TM as   icd_code,
      c.ICD_NAME as  icd_name,
    CASE 
    WHEN b.DXT_ID  = 1  THEN 'primary'
    WHEN b.DXT_ID  = 2  THEN 'comorbildity'
    WHEN b.DXT_ID  = 3  THEN 'complication'
    WHEN b.DXT_ID  = 4  THEN 'orther'
    WHEN b.DXT_ID  = 5  THEN 'external cause'
        END as  diag_type
    FROM  opd_visits a
    INNER JOIN opd_diagnosis b  ON a.VISIT_ID  = b.VISIT_ID  AND b.IS_CANCEL =0
    INNER JOIN  icd10new  c  ON  b.ICD10  = c.ICD10 
    WHERE a.is_cancel = 0 AND a.VISIT_ID = '${seq}'`);
    return data[0];
  }

  async getRefer(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT
      a.VISIT_ID AS seq,
      DATE(a.REG_DATETIME) date_serv,
      TIME(a.REG_DATETIME) time_serv,
      b.HOSP_ID AS to_provider_code,
      c.HOSP_NAME AS to_provider_name,
      b.RF_REASON AS reason,
      DATE(b.RF_DT) start_date
    FROM
      opd_visits a
    INNER JOIN refers b ON a.VISIT_ID = b.VISIT_ID
    AND b.IS_CANCEL = 0
    AND b.RF_TYPE = 2
    INNER JOIN hospitals c ON b.HOSP_ID = c.HOSP_ID
    WHERE
      a.IS_CANCEL = 0 AND a.VISIT_ID = '${seq}' `);
    return data[0];
  }


  async getDrugs(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT   
    a.VISIT_ID as "seq",
   DATE(a.REG_DATETIME) as "date_serv",
    TIME(a.reg_datetime) as time_serv, 
    CONCAT(c.DRUG_NAME,' ',CAST(c.STRENGTH AS DECIMAL),' ',  g.strength_name, ' ','(' ,h.DFORM_NAME,')') as drug_name, 
        b.rx_amount AS qty,d.UUNIT_THAI  as unit,
    CONCAT(e.ROUTE_THAI,' ',CONVERT(b.RX_DOSE,DECIMAL), ' ',  d.UUNIT_THAI,' ',f.FRQ_THAI )  as  usage_line1
    FROM  opd_visits  a 
    INNER JOIN  prescriptions b ON a.VISIT_ID = b.VISIT_ID AND a.IS_CANCEL = 0 AND  b.IS_CANCEL = 0 
    LEFT JOIN drugs c ON  b.DRUG_ID  = c.DRUG_ID 
    LEFT JOIN  usage_units d ON  c.UUNIT_ID = d.UUNIT_ID
    LEFT  JOIN  routes e  ON  b.ROUTE_ID  = e.ROUTE_ID
    LEFT JOIN frequency f on b.FRQ_ID = f.FRQ_ID
    LEFT JOIN strength_units g on c.STRENGTH_UNIT = g.strength_unit
    LEFT JOIN dosage_forms h ON c.DFORM_ID = h.DFORM_ID
    WHERE  a.IS_CANCEL = 0 AND a.VISIT_ID = '${seq}'`);
    return data[0];
  }

  async getLabs(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT
    a.VISIT_ID seq,
      DATE(a.REG_DATETIME) date_serv,
      TIME(a.REG_DATETIME) time_serv,
        c.LAB_SNAME  as lab_name,
    CASE 
      WHEN CAST(b.LAB_RESULT AS DECIMAL(10,2)) > 0 THEN CAST(b.LAB_RESULT AS DECIMAL(10,2)) 
      WHEN LOCATE('=', b.LAB_RESULT) > 0 THEN CAST(SUBSTR(b.LAB_RESULT, LOCATE('=', b.LAB_RESULT)+1, 12) AS DECIMAL(10, 2))
      END as lab_result,c.normal_val  standard_result
    FROM  opd_visits a
    RIGHT JOIN lab_requests  b ON a.VISIT_ID = b.VISIT_ID 
    INNER JOIN lab_lists c ON b.LAB_ID = c.LAB_ID  
    WHERE a.is_cancel = 0 AND a.VISIT_ID = '${seq}' `);
    return data[0];
  }


  async getAppointment(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT
      c.VISIT_ID as seq,
      b.UNIT_NAME clinic,
      DATE(c.REG_DATETIME) date_serv,
      TIME(c.REG_DATETIME)  time_serv,
      a.AP_DATE  appoint_date,
      DATE(a.AP_DT)  appoint_time,
      a.AP_MEMO detail
    FROM
      appoints a
    LEFT  JOIN service_units b ON a.APP_UNIT = b.UNIT_ID
    INNER JOIN opd_visits c ON a.HN = c.HN AND c.IS_CANCEL = 0
    WHERE   a.AP_DATE > c.REG_DATETIME
    AND c.VISIT_ID = '${seq}' `);
    return data[0];
  }

  async getVaccine(db: Knex, hn: any) {
    let data = await db.raw(`
    SELECT
    a.VISIT_ID as seq,
    DATE(a.REG_DATETIME) date_serv,
    TIME(a.REG_DATETIME)  time_serv,
    c.DRUG_THO as  vaccine_code,
      c.DRUG_NAME as vaccine_name
    FROM  opd_visits a
    INNER JOIN prescriptions b ON a.VISIT_ID = b.VISIT_ID  AND b.IS_CANCEL = 0
    LEFT  JOIN drugs_tho  c  ON b.DRUG_ID  = c.DRUG_ID
    WHERE a.IS_CANCEL = 0
    AND a.HN  = '${hn}' `);
    return data[0];
  }
  async getProcedure(db: Knex, hn: any, seq: any) {
    let data = await db.raw(`
    SELECT
        a.VISIT_ID AS seq,
        DATE(a.REG_DATETIME) AS date_serv,
        TIME(a.REG_DATETIME) AS time_serv,
        c. CODE AS procedure_code,
        c.TNAME AS procedure_name,
        DATE(b.OP_BEGIN) AS start_date,
        DATE(b.OP_END) AS end_date
      FROM
        opd_visits a
      INNER JOIN opd_operations b ON a.VISIT_ID = b.VISIT_ID
      AND b.IS_CANCEL = 0
      INNER JOIN icd9cm c ON b.icd9 = c.ICD9
      WHERE a.VISIT_ID = '${seq}' `);
    return data[0];
  }
  async getPtDetail(db: Knex, seq: any) {
    let data = await db.raw(`
  SELECT 
    CASE 
      WHEN PRENAME not in('') THEN PRENAME
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 < '20' AND sex='1' AND MARRIAGE = '4'THEN 'สามเณร'
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 >= '20' AND sex='1' AND MARRIAGE = '4'THEN 'พระภิกษุ'
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 < '15'  AND sex='1' THEN 'เด็กชาย'
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 >= '15' AND sex='1' THEN 'นาย'
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 < '15'  AND sex='2' THEN 'เด็กหญิง'
      WHEN DATEDIFF(now(),BIRTHDATE)/365.25 >= '15' AND sex='2' AND MARRIAGE='1' THEN 'นางสาว'
    ELSE 'นาง'
    END AS title_name, a.fname as first_name, a.lname as last_name
    FROM population a
    LEFT JOIN cid_hn b ON a.CID = b.CID
    WHERE b.HN = '${seq}' `);
    return data[0];
  }
}