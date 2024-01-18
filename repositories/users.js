const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename)
      throw new Error("Creating a new repository requires a filename");

    this.filename = filename;

    try {
      // Check to see if file already exist
      fs.accessSync(this.filename);
    } catch (error) {
      // If file doesn't exist, create a new file
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    // Open the file called this.filename and parse its content and return the data
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf8",
      })
    );
  }

  async create(attributes) {
    attributes.id = this.randomId();

    const records = await this.getAll();

    const salt = crypto.randomBytes(8).toString("hex");
    const buff = await scrypt(attributes.password, salt, 64);

    // Record object is the same as attribute object but with an updated password
    const record = records.push({
      ...attributes,
      password: `${buff.toString("hex")}.${salt}`,
    });

    console.log(record);

    // Replace existing record with a new one
    await this.writeAll(records);

    return record;
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecord = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecord);
  }

  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (const record of records) {
      let found = true;

      for (const key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
