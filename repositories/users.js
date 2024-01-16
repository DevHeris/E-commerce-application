const fs = require("fs");

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
    // Open the file called this.filename
    const content = await fs.promises.readFile(this.filename, {
      encoding: "utf8",
    });
    // Read its content
    console.log(content);
    // Parse the contents
    // Return the parsed data
  }
}

const repo = new UsersRepository("users.json");
repo.getAll();
