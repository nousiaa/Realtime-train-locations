import assert from 'assert';
import Database from 'better-sqlite3';
import api from '../api';
import auth from '../auth';
import dbService from '../db/db';

const db = new Database(':memory:', {});

db.prepare(
  `CREATE TABLE USER (
            user_name Varchar PRIMARY KEY,
            full_name Varchar,
            email Varchar,
            passwd Varchar
            );`,
).run();

describe('updating train data', () => {
  it('should work', () => {
    const res = api.updateTrain({
      params: { id: 0 },
      body: {
        speed: 0,
        name: 'Helsinki',
        destination: '',
        coordinates: [24.945831, 60.192059],
      },
    });

    const res1 = api.updateTrain({
      params: { id: 0 },
      body: {
        speed: 0,
        name: 'Helsinki',
        destination: '',
        coordinates: [20.945831, 63.192059],
      },
    });

    const res2 = api.updateTrain({
      params: { id: 2 },
      body: {
        speed: 0,
        name: 'Helsinki',
        destination: '',
        coordinates: [24.945831, 60.192059],
      },
    });
    const res3 = api.updateTrain({
      params: { id: 2 },
      body: {
        speed: 0,
        destination: '',
        coordinates: [24.945831, 60.192059],
      },
    });
    assert(res === 201 && res1 === 200 && res2 === 201 && res3 === 400);
  });
});

describe('getting train data with wrong key', () => {
  it('should NOT work', () => {
    const req = { body: { key: 'aaaaa', dataSource: false } };
    const res = api.getMap(req, db);
    assert(!res.success);
  });
});

describe('getting train data with right key from own api', () => {
  it('should work', () => {
    let req = {
      body: {
        username: 'nimi',
        password: 'salasana',
        fullname: 'c',
        email: 'a@a.a',
      },
    };
    api.addUser(req, db);
    const res = dbService.getUser(db, {
      username: req.body.username,
    });

    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    req = { body: { key, dataSource: false } };
    const res2 = api.getMap(req, db);
    assert(res2.success && res2.result != null);
  });
});
describe('getting train data with right key from ext api', () => {
  it('should work', () => {
    let req = {
      body: {
        username: 'nimi',
        password: 'salasana',
        fullname: 'c',
        email: 'a@a.a',
      },
    };
    api.addUser(req, db);
    const res = dbService.getUser(db, {
      username: req.body.username,
    });

    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    req = { body: { key, dataSource: true } };
    const res2 = api.getMap(req, db);
    assert(res2.success && res2.result != null);
  });
});
