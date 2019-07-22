import Knex = require('knex');
export class HisSuansaranromModel {

	async getHospital(db: Knex, providerCode: any, hn: any) {
		let data = await db.raw(`SELECT
									hcode AS provider_code,
									hname AS provider_name
								FROM hospital_setting
								WHERE h_code = ${providerCode}`);
		return data[0];
	}

	async getProfile(db: Knex, hn: any) {
		let data = await db.raw(`SELECT
										hn,
										CID AS cid,
										description AS title_name,
										FNAME AS first_name,
										LNAME AS last_name
										FROM tb_person
										INNER JOIN ref_prename ON tb_person.PRENAME = ref_prename.CODE
										WHERE tb_person.HN = '${hn}'`);
		return data[0];
	}

	async getServices(db: Knex, hn: any, dateServe: any) {
		let data = await db.raw(`SELECT
									tb_opd.OPD_ID as seq,
									tb_opd.DATE_SERV as date_serv
								FROM
								tb_opd
								WHERE tb_opd.HN ='${hn}'
								AND tb_opd.DATE_SERV = '${dateServe}'`);
		return data[0];

	}

	async getAllergyDetail(db: Knex, hn: any) {
		let data = await db.raw(`SELECT
									opd_allergy.drug_name as drug_name,
									opd_allergy.symptom as symptom
								FROM
								opd_allergy
								WHERE opd_allergy.HN = '${hn}'`);
		return data[0];

	}

	async getChronic(db: Knex, hn: any) {
		let data = await db.raw(`SELECT
									tb_opd_fu_chronic.icd_code as icd_code,
									tb_opd_fu_chronic.icd_name as icd_name,
									tb_opd_fu_chronic.start_date as start_date
								FROM
								tb_opd_fu_chronic
								WHERE tb_opd_fu_chronic.HN = '${hn}'`);
		return data[0];

	}


	async getDiagnosis(db: Knex, hn: any, dateServe: any) {
		let data = await db.raw(`SELECT
									 tb_opd_fu_diag.DIAG_DATE AS dateServe,
									 tb_opd_fu_diag.DIAG_CODE AS icd_code,
									 ref_diagcode.DESCRIPTION AS icd_name,
									 ref_diagtype.DESCRIPTION AS diage_type
								FROM tb_opd_fu_diag
								INNER JOIN ref_diagcode ON tb_opd_fu_diag.DIAG_CODE = ref_diagcode.CODE
								INNER JOIN ref_diagtype ON tb_opd_fu_diag.diag_type = ref_diagtype.CODE
								WHERE tb_opd_fu_diag.HN ='${hn}'
								AND tb_opd_fu_diag.DIAG_DATE = '${dateServe}'`);
		return data[0];
	}

	async getRefer(db: Knex, hn: any, dateServe: any, seq: any) {
		let data = await db.raw(`SELECT
									tb_refer_send.SEND_DATE as date_serv,
									TIME(tb_refer_send.MODIFY_DATE) as time_serv,
									tb_refer_send.RECEIVE_HOSP as to_provider_code,
									ref_hosp.description as to_provider_name,
									tb_refer_send.SEND_CAUSE as reason,
									DATE(tb_refer_send.CREATE_DATE) as start_date
									FROM
									tb_refer_send
								INNER JOIN ref_hosp ON tb_refer_send.RECEIVE_HOSP = ref_hosp.code
								WHERE tb_refer_send.HN = '${hn}'`);
		return data[0];

	}

	async getProcedure(db: Knex, hn: any, dateServe: any, vn: any) {
		let data = await db.raw(`SELECT
									tb_opd_fu_procedure.ORDER_NO as seq,
									tb_opd_fu_procedure.PROCEDURE_CODE as procedure_code,
									ref_procedure.description as procedure_name,
									tb_opd_fu_procedure.PROCEDURE_DATE as start_date,
									TIME(tb_opd_fu_procedure.MODIFY_DATE) as start_time
								FROM
								tb_opd_fu_procedure
								INNER JOIN ref_procedure ON tb_opd_fu_procedure.PROCEDURE_CODE = ref_procedure.code
								WHERE tb_opd_fu_procedure.HN ='${hn}'
								AND tb_opd_fu_procedure.PROCEDURE_DATE = '${dateServe}'`);
		return data[0];

	}

	async getDrugs(db: Knex, hn: any, dateServe: any, seq: any) {
		let data = await db.raw(`SELECT
									tb_drug_item.DNAME AS drug_name,
									tb_opd_drug.ISSUE_QTY AS qty,
									tb_opd_drug.DRUG_ADMIN AS unit,
									tb_opd_drug.DESC1 AS usage_line1,
									tb_opd_drug.DESC2 AS usage_line2,
									tb_opd_drug.DESC3 AS usage_line3
									FROM
								tb_opd_drug
								INNER JOIN tb_drug_item ON tb_opd_drug.DID = tb_drug_item.DID
								WHERE tb_opd_drug.HN ='${hn}'
								AND tb_opd_drug.ISSUE_DATE = '${dateServe}'`);
		return data[0];

	}

	async getLabs(db: Knex, hn: any, dateServe: any, seq: any) {
		let data = await db.raw(`SELECT
									tb_lab.ORDER_NO as seq,
									tb_lab.REQ_DATE as date_serv,
									TIME(tb_lab.REQ_TIME) as time_serv,
									tb_lab_master.LAB_NAME as lab_name,
									tb_lab.LAB_RESULT as lab_result,
									tb_lab_master.NORMAL_RANGE_DESC as standard_result,
								FROM tb_lab
								INNER JOIN tb_lab_master ON tb_lab.LAB_CODE = tb_lab_master.LAB_CODE
								WHERE tb_lab.HN ='${hn}'
								AND tb_lab.REQ_DATE = '${dateServe}'`);
		return data[0];

	}

	async getAppointment(db: Knex, hn: any, dateServe: any, seq: any) {
		let data = await db.raw(`SELECT
									tb_appointment.ORDER_NO as seq,
									tb_appointment.APPOINTMENT_DATE as date,
									TIME(tb_appointment.APPOINTMENT_TIME_FROM) AS time,
									tb_department.DEPARTMENT_NAME as department,
									IF(CONCAT(tb_appointment_master.DESCRIPTION,':',tb_appointment.BEFORE_APPOINTMENT) IS NULL,'-',CONCAT(tb_appointment_master.DESCRIPTION,':',tb_appointment.BEFORE_APPOINTMENT)) as detail
								FROM
								tb_appointment
								INNER JOIN tb_department ON tb_appointment.NEXT_DEPARTMENT_ID = tb_department.DEPARTMENT_ID
								LEFT JOIN tb_appointment_master ON tb_appointment.APPOINTMENT_DETAIL_A1 = tb_appointment_master.CODE
								WHERE tb_appointment.HN ='${hn}'
								AND tb_appointment.APPOINTMENT_DATE = '${dateServe}'`);
		return data[0];

	}

	async getVaccine(db: Knex, hn: any) {
		let data = await db.raw(`SELECT
									tb_opd_fu_vaccine.DATE_SERVE as date_serv,
									TIME(tb_opd_fu_vaccine.TIME_SERVE) as time_serv,
									tb_opd_fu_vaccine.vaccine_code as vaccine_code,
									tb_opd_fu_vaccine.vaccine_name as vaccine_name
								FROM
								tb_opd_fu_vaccine
								WHERE tb_opd_fu_vaccine.HN = '${hn}'`);
		return data[0];

	}

}