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

  if (existingUser) return res.send("User already exists");
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

app.listen(3000, () => {
  console.log("listening");
});
