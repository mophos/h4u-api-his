import { HisJhcisModel } from './../models/his_jhcis.model';
import { HisHosxpv3Model } from './../models/his_hosxpv3.model';
import { HisHiModel } from './../models/his_hi.model';
import { HisJhosModel } from './../models/his_jhos.model';
const hisJhcisModel = new HisJhcisModel();
const hisHosxpv3Model = new HisHosxpv3Model();
const hisHiModel = new HisHiModel();
const hisJhosModel = new HisJhosModel();
import * as moment from 'moment';

export class Vaccines {
  async his_jhcis(db, hn, requestId) {
    // try {
      const rs: any = await hisJhcisModel.getVaccine(db, hn);
      console.log(rs);
      
      const vaccines = [];
      rs.forEach(v => {
        const obj: any = {
          "date_serve": moment(v.date_serve).format('YYYY-MM-DD'),
          "time_serve": null,
          "vaccine_code": v.vaccine_code,
          "vaccine_name": v.vaccine_name

        }
        vaccines.push(obj);
      });
      const data = {
        "request_id": requestId,
        "vaccines": vaccines
      }
      return ({ ok: true, rows: data });
    // } catch (error) {
    //   return ({ ok: false, error: error });
    // }
  }

  async his_jhos(db, hn, hcode) {
  }

  async his_hosxp(db, hn, hcode) {
  }

  async his_hi(db, hn, hcode) {
  }

}