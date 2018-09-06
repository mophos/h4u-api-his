
const request = require("request");
export class StaffModel {
  getOfficers(token, query, status) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://h4u.moph.go.th/api/officer/v1/staff/officers?query=${query}&status=${status}`,
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

  updateOfficers(token, officer) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'PUT',
        url: `https://h4u.moph.go.th/api/officer/v1/staff/officers`,
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

  getOfficerPermission(token, email) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `https://h4u.moph.go.th/api/officer/v1/staff/officers/permission?email=${email}`,
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

  // sendNoData(token, requestId) {
  //   return new Promise((resolve: any, reject: any) => {
  //     var options = {
  //       method: 'POST',
  //       url: `https://h4u.moph.go.th/api/officer/v1/requests/nodata`,
  //       agentOptions: {
  //         rejectUnauthorized: false
  //       },
  //       headers:
  //       {
  //         'cache-control': 'no-cache',
  //         'content-type': 'application/json',
  //         'authorization': `Bearer ${token}`,
  //       },
  //       body: {
  //         requestId: requestId
  //       },
  //       json: true
  //     };

  //     request(options, function (error, response, body) {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(body);
  //       }
  //     });
  //   });
  // }



}