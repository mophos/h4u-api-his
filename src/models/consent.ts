const request = require("request");
// import * as jwt from 'jsonwebtoken'
// import * as bcrypt from 'bcrypt';
;

export class ConsentModel {



  getList(token, query) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://h4u.moph.go.th/api/officer/v1/consents?query=${query}`,
        // url: `http://localhost:3003/consents?query=${query}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  updateTel(token, cid, userId, tel) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'PUT',
        url: `https://h4u.moph.go.th/api/officer/v1/consents/tel`,
        // url: `http://localhost:3003/consents?query=${query}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          cid: cid,
          userId: userId,
          tel: tel
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  save(token, cid, fname, lname, tel, birthdate, imageBase64, parent) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `https://h4u.moph.go.th/api/officer/v1/consents`,
        // url: `http://localhost:3003/consents?query=${query}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          cid: cid,
          fname: fname,
          lname: lname,
          tel: tel,
          birthday: birthdate,
          imageBase64: imageBase64,
          parent: parent
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  saveImage(token, cid, userId, imageBase64) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `https://h4u.moph.go.th/api/officer/v1/consents/image`,
        // url: `http://localhost:3003/consents/image`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          cid: cid,
          userId: userId,
          imageBase64: imageBase64
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  getImage(token, id, cid) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://h4u.moph.go.th/api/officer/v1/consents/image?cid=${cid}&id=${id}`,
        // url: `http://localhost:3003/consents/image?cid=${cid}&id=${id}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  getParent(token, id, cid) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://h4u.moph.go.th/api/officer/v1/consents/parent?cid=${cid}&id=${id}`,
        // url: `http://localhost:3003/consents/image?cid=${cid}&id=${id}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  updateParent(token, id, cid, parent) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'PUT',
        url: `https://h4u.moph.go.th/api/officer/v1/consents/parent`,
        // url: `http://localhost:3003/consents/image?cid=${cid}&id=${id}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: {
          id: id,
          cid: cid,
          parent: parent
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  getSmarthealth(cid, token) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://smarthealth.service.moph.go.th/phps/api/person/v2/findby/cid?cid=${cid}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'postman-token': 'c63b4187-f395-a969-dd57-19018273670b',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'jwt-token': token
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
  // async compareHash(password, hash) {
  //   if (bcrypt.compareSync(password, hash)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

}