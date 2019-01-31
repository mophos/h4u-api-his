
const request = require("request");
export class RequestsModel {
  getRequests(token, status) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        // url: `https://h4u.moph/go.th/api/officer/v1/requests?status=${status}`,
        url: `https://h4u.moph.go.th/api/officer/v1/requests?status=${status}`,
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

  sendNoData(token, requestId) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `https://h4u.moph.go.th/api/officer/v1/requests/nodata`,
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
          requestId: requestId
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

  sendCancel(token, requestId) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'POST',
        url: `https://h4u.moph.go.th/api/officer/v1/requests/cancel`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
        body: { requestId: requestId },
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