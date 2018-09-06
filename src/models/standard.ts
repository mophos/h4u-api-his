
const request = require("request");
export class StandardModel {

  getPermission(token) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `http://localhost:3002/standard/permission`,
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


}