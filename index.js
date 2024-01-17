const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const UsersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ["ioghrbvduif"] }));

// Route handler
app.get("/signup", (req, res) => {
  res.send(`
  <div>
Your id is : ${req.session.userId}
      <form method="POST">
            <input name="email" type="email" placeholder="email">
            <input name="password" type="password" placeholder="password">
            <input name="passwordConfirmation" type="password" placeholder="password confirmation">
            <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await UsersRepo.getOneBy({ email });

  // Note that we are returning "early" from these if statements

  // Email check
  if (existingUser) return res.send("User already exists");

  // Password check
  if (password !== passwordConfirmation)
    return res.send("Passwords must match");

  // Create a user in our user repo to represent this person
  const user = await UsersRepo.create({ email, password });

  // Store the ID of that user inside the users cookie
  req.session.userId = user.id;

  res.send("Account Created!!!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You have now signed out");
});

app.get("/signin", async (req, res) => {
  res.send(`
  <div>
    <form method="POST">
        <input name="email" type="email" placeholder="email">
        <input name="password" type="password" placeholder="password">
        <button>Sign In</button>
    </form>
  </div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersRepo.getOneBy({ email });

  // Note that we are returning "early" from these if statements

  // Email check
  if (!user) return res.send(`Email not found`);

  // Password check
  if (password !== user.password) return res.send("Invalid password");

  req.session.userId = user.id;

  res.send("You are now signed in");
});

app.listen(3000, () => {
  console.log("listening");
});
