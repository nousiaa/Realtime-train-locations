module.exports = {
  // get user from database
  getUser(db, args) {
    return db.prepare('SELECT * FROM USER WHERE user_name=?;').get(args.username);
  },

  // add user to database
  addUser(db, args) {
    db.prepare('INSERT INTO USER (user_name, passwd, email, full_name) VALUES (?,?,?,?);').run(args.username, args.password, args.email, args.fullname);
    return true;
  },
};
