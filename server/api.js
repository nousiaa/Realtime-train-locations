import dbService from './db/db';
import auth from './auth';
import mapData from './getMap';

// Helper functions

// Test if arg is string
function isString(arg) {
  return typeof arg === 'string';
}

// Test if arg is a string containing an email address
function isEmail(arg) {
  const re = /\S+@\S+\.\S+/;
  return re.test(arg);
}

// All functions needed for the api
module.exports = {
  // Return a list of all available train locations
  // takes in a key used to authenticate user and return data if user is real
  getMap(req, db) {
    // initial return value
    let success = false;
    let result = null;
    // does request have required key?
    if (isString(req.body.key)) {
      // check if given key can be decrypted
      const key = auth.checkKey(req.body.key);
      if (isString(key.password) && isString(key.username)) {
        // get user with same username as our key
        const thisUser = dbService.getUser(db, {
          username: key.username,
        });
        // does the hash in the database match the hash in the key?
        if (thisUser.passwd === key.password) {
          // get the train location data that the user wants
          success = true;
          if (req.body.dataSource) {
            result = mapData.getMapData();
          } else {
            result = mapData.getMapDataFromOwnApi();
          }
        }
      }
    }
    // return our success indicator and data depending on situation
    return ({ success, result });
  },

  // Adds an user to the database
  // Takes in a username and a password, returns a status code and a boolean depending on result
  addUser(req, db) {
    // initial return value
    let result = false;
    let code = 400;
    // check if we are given all information needed for creating an account
    if (isString(req.body.username)
        && req.body.username.length > 0
        && isString(req.body.password)
        && isEmail(req.body.email)
        && isString(req.body.fullname)) {
      code = 409;
      // check that the username is not already in use
      const thisUser = dbService.getUser(db, {
        username: req.body.username,
      });
      if (thisUser == null) {
        code = 200;
        // checks passed, create the wanted user account
        result = dbService.addUser(db, {
          username: req.body.username,
          password: auth.hash(req.body.password),
          email: req.body.email,
          fullname: req.body.fullname,
        });
      }
    }
    // return status code and boolean
    return { code, value: result };
  },

  // Authenticate the user
  // Takes in username and password, returns a key used for authentication by some api endpoints
  login(req, db) {
    // default value for returned key
    let key = '';
    // check if we are given all information needed for logging in
    if (isString(req.body.username)
    && req.body.username.length > 0
    && isString(req.body.password)) {
      // get user with specified username
      const thisUser = dbService.getUser(db, {
        username: req.body.username,
      });
      // does the wanted user exist
      if (thisUser) {
        // check if password matches the hash from the database
        const result = auth.verify(req.body.password, thisUser.passwd);
        // if password is correct, create a key for the user
        if (result) {
          key = auth.makeKey(
            JSON.stringify({ username: thisUser.user_name, password: thisUser.passwd }),
          );
        }
        // return the key to the user
        return { success: result, key };
      }
    }
    // if all data is not given, fail
    return { success: false, key };
  },

  // Update train locations when new data comes in
  // Takes in id and a train formatted object
  updateTrain(req) {
    // get train id
    const id = parseInt(req.params.id, 10);
    // add id to the object
    const updatedTrain = req.body;
    updatedTrain.id = id;
    // pass the data to a funtion that handles the train location changes
    return mapData.updateTrainFromApi(id, updatedTrain);
  },

  // Return the user matching the given user key
  getUser(req, db) {
    // Does the key exist
    if (isString(req.body.key)) {
      // decrypt the keyh
      const key = auth.checkKey(req.body.key);
      // does the key contain username & password
      if (isString(key.password) && isString(key.username)) {
        // get the user
        const thisUser = dbService.getUser(db, {
          username: key.username,
        });
        thisUser.success = true;
        // does the password from the key match?
        if (thisUser.passwd === key.password) {
          // return the user
          return {
            success: true,
            user_name: thisUser.user_name,
            email: thisUser.email,
            full_name: thisUser.full_name,
          };
        }
      }
    }
    // return an auth failure
    return { success: false };
  },
};
