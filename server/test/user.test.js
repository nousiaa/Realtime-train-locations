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

describe('Adding users ', () => {
  it('should work', () => {
    const req = {
      body: {
        username: 'nimi',
        password: 'salasana',
        fullname: 'c',
        email: 'a@a.a',
      },
    };
    const res1 = api.addUser(req, db);
    const res = dbService.getUser(db, {
      username: req.body.username,
    });
    assert(res.user_name === req.body.username && res1.code === 200);
  });
});

describe('Adding duplicate users ', () => {
  it('should NOT work', () => {
    const req = {
      body: {
        username: 'nimi',
        password: 'salasana',
        fullname: 'c',
        email: 'a@a.a',
      },
    };
    const res1 = api.addUser(req, db);
    const res = dbService.getUser(db, {
      username: req.body.username,
    });
    assert(res.user_name === req.body.username && res1.code === 409);
  });
});
describe('Adding users with a malformed email address', () => {
  it('should NOT work', () => {
    const req = {
      body: {
        username: 'nimi22',
        password: 'salasana',
        fullname: 'c',
        email: 'a.a',
      },
    };
    const res1 = api.addUser(req, db);
    assert(res1.code === 400);
  });
});
describe('Adding users without full name or email', () => {
  it('should NOT work', () => {
    const req = { body: { username: 'nimi99', password: 'salasana' } };
    const res1 = api.addUser(req, db);
    assert(res1.code === 400);
  });
});
describe('Getting users without key', () => {
  it('should NOT work', () => {
    const req = { body: {} };
    const res1 = api.getUser(req, db);
    assert(!res1.success);
  });
});

describe('Getting users with key', () => {
  it('should work', () => {
    const res = dbService.getUser(db, {
      username: 'nimi',
    });
    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    const req = { body: { key } };
    const res1 = api.getUser(req, db);
    assert(res1.user_name === 'nimi' && res1.success);
  });
});

describe('Logging in with correct info', () => {
  it('should work', () => {
    const req = { body: { username: 'nimi', password: 'salasana' } };
    const res1 = api.login(req, db);
    const res = dbService.getUser(db, {
      username: 'nimi',
    });
    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    assert(res1.key === key && res1.success);
  });
});

describe('Logging in with wrong username and password', () => {
  it('should NOT work', () => {
    const req = { body: { username: 'vaara', password: 'vaara' } };
    const res1 = api.login(req, db);
    const res = dbService.getUser(db, {
      username: 'nimi',
    });
    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    assert(res1.key !== key && !res1.success);
  });
});

describe('Logging in with wrong password', () => {
  it('should NOT work', () => {
    const req = { body: { username: 'nimi', password: 'vaara' } };
    const res1 = api.login(req, db);
    const res = dbService.getUser(db, {
      username: 'nimi',
    });
    const key = auth.makeKey(JSON.stringify({ username: res.user_name, password: res.passwd }));
    assert(res1.key !== key && !res1.success);
  });
});
