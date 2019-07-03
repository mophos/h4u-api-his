import Knex = require('knex');

// ตัวอย่าง query แบบ knex
// getHospital(db: Knex,hn:any) {
//   return db('opdconfig as o')
//     .select('o.hospitalcode as hcode', 'o.hospitalname as hname')
// }
// ตัวอย่างการคิวรี่โดยใช้ raw MySqlConnectionConfig
// async getHospital(db: Knex,hn:any) {
//   let data = await db.raw(`select * from opdconfig`);
// return data[0];
// }
export class HisJvkModel {

    async getHospital(db: Knex, providerCode: any, hn: any) {
        // ชื่อสถานพยาบาล
        let data = await db.raw(`SELECT h_code AS provider_code, 
        h_name AS provider_name
    FROM nano_hospital_code AS hospital
    WHERE h_code = ${providerCode}`);
        return data[0];
    }

    async getProfile(db: Knex, hn: any) {
        let data = await db.raw(`SELECT 	hn,
        pa_people_number AS cid,
            pa_pre_name AS title_name,
                pa_name AS first_name,
                    pa_lastname AS last_name
    FROM nano_patient
    WHERE hn = '${hn}'`);
        return data[0];
    }

    async getServices(db: Knex, hn: any, dateServe: any) {
        let data = await db.raw(`SELECT 	visit.hn,
        to_char(orders.order_date,'YYYY-MM-DD') AS dateServe,
        orders.order_type AS type,
        itemn.name AS detail,
        items.qty AS frequency
    FROM medrec.nano_visit AS visit
    INNER JOIN med.neural_order AS orders ON (visit.id = orders.vn_id)
    INNER JOIN med.neural_order_item AS items ON (orders.id = items.order_id)
    INNER JOIN finance.sr_item AS itemn ON (items.item_id = itemn.id)
    WHERE visit.hn = 'hn: any'
    AND orders.order_date = '${dateServe}'
    GROUP BY visit.hn,dateserve,order_type,name,qty`);
        return data[0];
    }

    async getAllergyDetail(db: Knex, hn: any) {
        let data = await db.raw(` SELECT 	drug_name,
        level_name AS symptom
    FROM nano_patient_allergic
    WHERE hn = '${hn}'`);
        return data[0];
    }

    async getChronic(db: Knex, hn: any) {
        let data = await db.raw(`SELECT 	icd10.code AS icd_code,
        icd10.name AS icd_name,
        to_char (diag.date,'YYYY-MM-DD') AS start_date
        FROM neural_order_icd10 AS diag
        INNER JOIN med.neural_icd10 AS icd10 ON (icd10.id = diag.icd10_id)
        INNER JOIN medrec.nano_visit AS visit ON (visit.id = diag.visit_id)
        WHERE diag.priority >= '3'
        AND visit.hn = '${hn}'
        GROUP BY icd_code,icd_name,start_date`);
        return data[0];
        // โรคเรื้อรัง
        // return [{icd_code:'',icd_name:'',start_date:''}]
    }


    async getDiagnosis(db: Knex, hn: any, dateServe: any, seq: any) {
        let data = await db.raw(`SELECT 	
        visit.hn,
        visit.time_add AS dateServe,
        icd10.code AS icd_code,
        icd10.name AS icd_name,
        priority AS diage_type
        FROM neural_order_icd10 AS diag
        INNER JOIN med.neural_icd10 AS icd10 ON(icd10.id = diag.icd10_id)
        INNER JOIN medrec.nano_visit AS visit ON(visit.id = diag.visit_id)
        WHERE visit.hn = '${hn}'
        AND visit.time_add = '${dateServe}'
        AND visit.id = '${seq}'`);
        return data[0];
    }

    async getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
        let data = await db.raw(`SELECT  
            hn,
            hospital_refer AS hcode_to,
            hospital.h_name AS name_to,
            dc_reason_detail AS reason
        FROM mi_ipd_main AS ipd
        INNER JOIN medrec.nano_hospital_code AS hospital ON(hospital.h_code = ipd.hospital_refer)
        WHERE hospital_refer IS NOT NULL AND hospital_refer > '1'
        AND hn = '${hn}'
        AND ipd.admit_date = '${dateServe}'
        AND ipd.vn_id = '${seq}'`);
        return data[0];
    }

    async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
        // Procedure
        let data = await db.raw(`SELECT    
            visit.id AS seq,
            items.icd_9_cm AS procedure_code,
            items.name AS procedure_name,
            to_char(order_item.date_add, 'YYYY-MM-DD') AS date_serv,
            to_char(order_item.date_add, 'HH24:MI:SS') AS time_serv,
            to_char(order_item.start_date, 'YYYY-MM-DD') AS start_date,
            to_char(order_item.start_date, 'HH24:MI:SS') AS start_time,
            to_char(order_item.end_date, 'YYYY-MM-DD') AS end_date,
            to_char(order_item.end_date, 'HH24:MI:SS') AS end_time
        FROM med.neural_order_item AS order_item
        INNER JOIN finance.sr_item AS items ON(items.id = order_item.item_id)
        INNER JOIN med.neural_order AS orders ON(orders.id = order_item.order_id)
        INNER JOIN medrec.nano_visit AS visit ON(visit.id = orders.vn_id)
        WHERE  visit.time_toclose IS NOT NULL
        AND visit.closed = 't'
        AND orders.deleted = 'f'
        AND order_item.type != 'drug'
        AND orders.order_type IN('dental', 'psycho', 'ECT', 'operative')
        AND visit.hn = '${hn}'
        AND to_char(orders.order_date, 'YYYY-MM-DD') = '${dateServe}'
        AND visit.vn = '${vn}'
        GROUP BY seq, procedure_code, procedure_name, date_serv, time_serv, start_date, start_time, end_date, end_time
        ORDER BY visit.time_add`);
        return data[0];


        // return [{seq:'',procedure_code:'',procedure_name:'',date_serv:'',time_serv:'',start_date:'',start_time:'',end_date:'',end_time:''}];
    }

    async getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
        let data = await db.raw(` SELECT 	drug.generic_name AS drug_name,
        items.qty,
        drug_dose.dose_med_name AS unit,
            drug_dose.name1 AS usage_line1,
                drug_dose.name2 AS usage_line2,
                    drug_dose.name3 AS usage_line3,
                        drug_dose.name4 AS usage_line4
    FROM drug.nano_drug AS drug
    INNER JOIN drug.nano_drug_formal_dose AS formal_dose ON(drug.formal_group_id = formal_dose.formal_id)
    INNER JOIN drug.nano_drug_dose AS drug_dose ON(formal_dose.dose_id = drug_dose.id)
    INNER JOIN med.neural_order_item AS items ON(items.drug_id = drug.id)
    INNER JOIN medrec.nano_visit AS visit ON(visit.id = items.vn_id)
    WHERE items.deleted = 'f'
    AND  visit.hn = '${hn}'
    AND visit.id = '${seq}'
    AND to_char(items.date_add, 'YYYY-MM-DD') = '${dateServe}'
    GROUP BY drug_name, qty, unit, usage_line1, usage_line2, usage_line3, usage_line4`);
        return data[0];
        //ยา


        // return [{drug_name:'',qty:'',unit:'',usage_line1:'',usage_line2:'',usage_line3:''}]
    }

    async getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
        let data = await db.raw(` SELECT  name AS lab_name,
            result.result AS lab_result,
                result.standard AS standard_result,
                    approve.vn_id AS seq,
                        to_char(items.date_add, 'HH24:MI:SS') AS time_serv,
                            to_char(items.date_add, 'YYYY-MM-DD') AS date_serv
        FROM lab_approve AS approve
        INNER JOIN med.neural_order_items AS item ON(items.order_id = approve.lab_order)
        INNER JOIN med.neural_record AS record ON(record.order_item_id = items.id)
        INNER JOIN lab.neural_lab_result  AS result ON(result.record_id = record.id)
        INNER JOIN lab.neural_lab_value  AS value ON(value.id = result.lab_value_id)
        INNER JOIN medrec.nano_visit AS visit ON(visit.id = record.vn_id)
        WHERE items.type = 'lab' AND items.deleted = 'f'
        AND visit.hn = '${hn}'
        AND items.date_add = '${dateServe}'
        AND visit.id = '${seq}'
        GROUP BY lab_name, lab_result, standard_result, seq, time_serv, date_serv`);
        return data[0];
        //แล็ป


        // return [{lab_name:'',lab_result:'',standard_result:'',seq:'',time_serv:'',date_serv:''}]
    }


    async getAppointment(db: Knex, hn: any, dateServ: any, seq: any) {
        let data = await db.raw(`SELECT 	to_char(appointment_date, 'YYYY-MM-DD') AS date,
            to_char(appointment_time, 'HH24:MI:SS') AS time,
                components.com_name AS department,
                    comment AS detail
        FROM neural_appointment AS appointment
        INNER JOIN medrec.nano_visit AS visit ON(visit.id = appointment.visit_id)
        INNER JOIN jvkk.nano_components AS components ON(components.id = appointment.component_id)
        WHERE appointment.deleted = 'f'
        AND visit.hn = '${hn}'
        AND to_char(appointment.created_date, 'YYYY-MM-DD') = '${dateServ}'
        AND visit.id = '${seq}'
        GROUP BY date, time, department, detail`);
        return data[0];
        //นัดหมาย


        // return [{date:'',time:'',department:'',detail:''}]
    }

    async getVaccine(db: Knex, hn: any) {
        let data = await db.raw(` SELECT to_char(orders.order_date, 'YYYY-MM-DD') AS date_serv,
            to_char(orders.order_date, 'HH24:MI:SS') AS time_serv,
                drugs.tmtid AS vaccine_code,
                    sr_items.name AS vaccine_name
        FROM med.neural_order AS orders
        INNER JOIN med.neural_order_item AS items ON(items.order_id = orders.id)
        INNER JOIN finance.sr_item AS sr_items ON(sr_items.id = items.item_id)
        INNER JOIN drug.nano_drug AS drugs ON(drugs.item_id = sr_items.id)
        INNER JOIN medrec.nano_visit AS visits ON(visits.id = orders.vn_id)
        WHERE items.item_id IN(2243, 2895, 3367)
        AND orders.deleted = 'f'
        AND items.deleted = 'f'
        AND visits.hn = '${hn}'
        ORDER BY orders.order_date`);
        return data[0];
        //วัคซีน


        //return [{date_serv:'',time_serv:'',vaccine_code:'',vaccine_name:''}]]
    }

}