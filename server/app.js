import express from 'express';
import Database from 'better-sqlite3';
import bodyParser from 'body-parser';
import getMap from './getMap';

const app = express();

// load our database
const db = new Database('./db/serverDB.db', {});

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// set CORS header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// set json parsing for body
app.use(bodyParser.json());

// enable our api endpoints
require('./route')(app, db);

// listen for traffic on given port
app.listen(process.env.PORT || 3100);

// start polling train location data from digitraffic
getMap.startTrainFetch();

console.log('Server started');
