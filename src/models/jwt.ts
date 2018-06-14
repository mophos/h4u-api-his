var jwt = require('jsonwebtoken');

export class JwtModel {
  // private secretKey = 'fbad30f996d330070d8989aa90fb8cb1dc949fd2172aa8fbfb3ee303be97d490';
  private secretKey = process.env.SECRET_KEY;
  sign(playload: any) {
    let token = jwt.sign(playload, this.secretKey, {
      expiresIn: '1d'
    });
    return token;
  }

  verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      });
    });
  }

}