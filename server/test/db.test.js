import assert from 'assert';
import Database from 'better-sqlite3';
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

describe('Adding and getting users straight to / from database', () => {
  it('should work', () => {
    dbService.addUser(db, {
      username: 'a',
      password: 'b',
      fullname: 'c',
      email: 'a@a.a',
    });
    const res = dbService.getUser(db, { username: 'a' });

    assert(
      res.user_name === 'a' && res.passwd === 'b' && res.full_name === 'c' && res.email === 'a@a.a',
    );
  });
});
