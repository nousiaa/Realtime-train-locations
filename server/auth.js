import bcrypt from 'bcrypt';
import crypto from 'crypto';


// our secret key used for encrypting and decrypting
const pass = 'topSecret';
// algorithm used for encrypting and decrypting
const algo = 'aes256';

module.exports = {
  // create a hash from given password
  hash(password) {
    return bcrypt.hashSync(password, 10);
  },
  // check password with given hash
  verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  },

  // generate a key that users use to authenticate with our api
  makeKey(key) {
    const cipher = crypto.createCipher(algo, pass);
    let res = cipher.update(key, 'utf8', 'hex');
    res += cipher.final('hex');
    return res;
  },
  // decrypt and return data from the key given
  checkKey(key) {
    try {
      const decipher = crypto.createDecipher(algo, pass);
      let res = decipher.update(key, 'hex', 'utf8');
      res += decipher.final('utf8');

      // parse and return
      return JSON.parse(res);
    } catch (e) {
      return {};
    }
  },
};
