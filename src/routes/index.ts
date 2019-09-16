
import { HisBudhospModel } from './../models/his_budhosp.model';
import { HisEzhospModel } from './../models/his_ezhosp.model';
import { HisHiModel } from './../models/his_hi.model';
import { HisHomcModel } from './../models/his_homc.model';
import { HisHospitalOsModel } from './../models/his_hospitalos.model';
import { HisHosxppcuModel } from './../models/his_hosxp_pcu.model';
import { HisHosxpv3Model } from './../models/his_hosxpv3.model';
import { HisHosxpv4Model } from './../models/his_hosxpv4.model';
import { HisHosxpv4pgModel } from '../models/his_hosxpv4_pg.model';
import { HisJhcisModel } from './../models/his_jhcis.model';
import { HisJhosModel } from './../models/his_jhos.model';
import { HisJvkkModel } from '../models/his_jvkk.model';
import { HisMbaseModel } from './../models/his_mbase.model';
import { HisNanhospModel } from './../models/his_nanhospitalsute.model';
import { HisSsb2Model } from './../models/his_ssb2.model';
import { HisSsbModel } from './../models/his_ssb.model';
import { HisSuansaranromModel } from '../models/his_suansaranrom.model';
import { HisUniversalModel } from './../models/his_universal.model';
// import { HospitalosModel } from './../models/his_hospital_os';
import { HisMkhospitalModel } from './../models/his_mkhospital.model';
import { HisUniversalSchemaModel } from './../models/his_universal_schema.model';
'use strict';
var request = require("request");
import * as express from 'express';
import { JwtModel } from '../models/jwt'
// model
const router = express.Router();

const provider = process.env.HIS_PROVIDER;
let hisModel: any;
switch (provider) {
  case 'ezhosp':
    hisModel = new HisEzhospModel();
    break;
  case 'hosxpv3':
    hisModel = new HisHosxpv3Model();
    break;
  case 'hosxpv4':
    hisModel = new HisHosxpv4Model();
    break;
  case 'hosxpv4pg':
    hisModel = new HisHosxpv4pgModel();
    break;
  case 'ssb':
    hisModel = new HisSsbModel();
    break;
  case 'ssb2':
    hisModel = new HisSsb2Model();
    break;
  case 'infod':
    // hisModel = new HisInfodModel();
    break;
  case 'hi':
    hisModel = new HisHiModel();
    break;
  case 'himpro':
    // hisModel = new HisHimproModel();
    break;
  case 'jhcis':
    hisModel = new HisJhcisModel();
    break;
  case 'hosxppcu':
    hisModel = new HisHosxppcuModel();
    break;
  case 'hospitalos':
    hisModel = new HisHospitalOsModel();
    break;
  case 'jhos':
    hisModel = new HisJhosModel();
    break;
  case 'pmk':
    // hisModel = new HisPmkModel();
    break;
  case 'meedee':
    // hisModel = new HisMdModel();
    break;
  case 'spdc':
    // hisModel = new HisSpdcModel();
    break;
  case 'homc':
    hisModel = new HisHomcModel();
    break;
  case 'budhosp':
    hisModel = new HisBudhospModel();
    break;
  case 'mbase':
    hisModel = new HisMbaseModel();
    break;
  // case 'hospitalos':
  //     hisModel = new HospitalosModel();
  //     break;
  case 'nanhis':
    hisModel = new HisNanhospModel();
    break;
  case 'jvkk':
    hisModel = new HisJvkkModel();
    break;
  case 'suansaranrom':
    hisModel = new HisSuansaranromModel();
    break;
  case 'mkh':
    hisModel = new HisMkhospitalModel();
    break;
  case 'universal':
    hisModel = new HisUniversalModel();
    break;
  case 'universal_schema':
    hisModel = new HisUniversalSchemaModel();
    break;
  default:
    hisModel = new HisUniversalModel();
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.send({ ok: true, rows: 'MOPH H4U API HIS' })
});

router.get('/test', async (req, res, next) => {
  try {
    let db = req.db;
    const rs = await hisModel.getHospital(db, null, null);
    res.send({ ok: true, rows: rs });

  } catch (error) {
    console.log(error);

    res.send({ ok: false, error: error });
  }
});
export default router;