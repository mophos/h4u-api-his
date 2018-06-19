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

  async his_hosxp(db, hn, requestId) {
    const rs: any = await hisHosxpv3Model.getVaccine(db, hn);
    console.log('HOSxP - rs: ', rs);

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
  }

  async his_hi(db, hn, requestId) {
    const vaccine: any[] = await hisHiModel.getEpiAll(db, hn);
    const vaccines = [];

    for (let item of vaccine[0]) {
      let objvaccines: any = {};
      objvaccines.date_serve = moment(item.date_serve).format("YYYY-MM-DD");

      let time: string;
      if (item.time_serve.toString().length === 3) {
        time = '0' + item.time_serve;

      } else {
        time = item.time_serve.toString();
      }

      objvaccines.time_serve = moment(time, "HH:mm:ss").format("HH:mm:ss");// moment(item.time).locale('th').format('HH:mm');
      objvaccines.vaccine_code = item.vaccine_code;
      objvaccines.vaccine_name = item.vaccine_name;
      vaccines.push(objvaccines);
    }

    // const vaccines = vaccine;
    // console.log(vaccines);

    const data = {
      "request_id": requestId,
      "vaccines": vaccines
    }
    return ({ ok: true, rows: data });
  }

}