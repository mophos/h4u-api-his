
const request = require("request");
export class MemberModel {

  getOfficer(token, email) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `http://localhost:3002/member/officer?email=${email}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
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

  register(token, officer) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `http://localhost:3002/member/register`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: {
          officer: officer
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


}