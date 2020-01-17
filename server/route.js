import api from './api';

// our api endpoints
module.exports = (app, db) => {
  // fetching train location if given correct key
  app.post('/api/mapData', (req, res) => {
    const ret = api.getMap(req, db);
    if (ret.success) {
      res.status(200).end(JSON.stringify(ret));
    } else {
      res.status(401).end(JSON.stringify(ret));
    }
  });

  // adding users to system
  app.post('/api/addUser', (req, res) => {
    const ret = api.addUser(req, db);
    res.status(ret.code).end(JSON.stringify(ret.value));
  });

  // user login
  app.post('/api/login', (req, res) => {
    const ret = api.login(req, db);
    if (ret.success) {
      res.status(200).end(JSON.stringify(ret));
    } else {
      res.status(401).end(JSON.stringify(ret));
    }
  });

  // fetching user based on key
  app.post('/api/getUser', (req, res) => {
    const ret = api.getUser(req, db);
    if (ret.success) {
      res.status(200).end(JSON.stringify(ret));
    } else {
      res.status(401).end(JSON.stringify(ret));
    }
  });

  // updating train locations (which path is the one wanted?)
  // in any case, enable both
  app.put('/api/trains/:id/location', (req, res) => {
    const ret = api.updateTrain(req);
    res.status(ret).end();
  });
  app.put('/trains/:id/location', (req, res) => {
    const ret = api.updateTrain(req);
    res.status(ret).end();
  });
};
