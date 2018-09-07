
const request = require("request");
export class ServicesModel {

  sendServices(token, services) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `https://h4u.moph.go.th/api/officer/v1/services`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        data: {
          services: services
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