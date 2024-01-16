const fs = require("fs");
const crypto = require("crypto");

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
    records.push(attributes);

    // Replace existing record with a new one
    await this.writeAll(records);
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
}

const test = async () => {
  const repo = new UsersRepository("users.json");

  await repo.delete("4bec2d0d");
};

test();
