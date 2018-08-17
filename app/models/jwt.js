"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
class JwtModel {
    constructor() {
        this.secretKey = process.env.SECRET_KEY;
    }
    sign(playload) {
        let token = jwt.sign(playload, this.secretKey, {
            expiresIn: '1d'
        });
        return token;
    }
    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretKey, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.JwtModel = JwtModel;
//# sourceMappingURL=jwt.js.map