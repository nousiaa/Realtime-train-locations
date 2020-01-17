import assert from 'assert';
import auth from '../auth';

describe('hashing and verifying passwords', () => {
  it('should work', () => {
    const pass = auth.hash('salasana');
    const res = auth.verify('salasana', pass);
    const res1 = auth.verify('vaara', pass);
    assert(res && !res1);
  });
});

describe('encrypting and decrypting user data', () => {
  it('should work', () => {
    const key = auth.makeKey(
      JSON.stringify({
        username: 'nimi',
        password: '$2b$10$1pX7MdJ6s/rAlMGwC6lgtuYum4AXeNZm.WBYi29p0ZGDyy/pESqBy',
      }),
    );
    const result = auth.checkKey(key);

    assert(
      result.username === 'nimi'
      && result.password === '$2b$10$1pX7MdJ6s/rAlMGwC6lgtuYum4AXeNZm.WBYi29p0ZGDyy/pESqBy',
    );
  });
});
