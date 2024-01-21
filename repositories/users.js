const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async create(attributes) {
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex"); // Hashed (password + salt)
    const buf = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll(); // record object is the same as the attributes object but with the updated (salted and hashed) password
    const record = {
      ...attributes,
      password: `${buf.toString("hex")}.${salt}`,
    };
    records.push(record);
    // Replace existing record with a new one
    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    // Saved -> password saved in our database. 'hashed.salt'
    // Supplied -> password given to us by a user trying sign in
    const [hashed, salt] = saved.split(".");
    // Have to await since scrypt returns a promise
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString("hex");
  }
}

module.exports = new UsersRepository("users.json");
