"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const bcrypt = require("bcrypt");
;
class LoginModel {
    smartHealhtLogin(username, password) {
        return new Promise((resolve, reject) => {
            var options = {
                method: 'POST',
                url: 'http://203.157.103.123/h4u/api/login/smh-login',
                agentOptions: {
                    rejectUnauthorized: false
                },
                headers: {
                    'postman-token': 'c63b4187-f395-a969-dd57-19018273670b',
                    'cache-control': 'no-cache',
                    'content-type': 'application/json'
                },
                body: { username: username, password: password },
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
    compareHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (bcrypt.compareSync(password, hash)) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.LoginModel = LoginModel;
//# sourceMappingURL=login.js.map