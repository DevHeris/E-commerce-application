const express = require("express");
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signinTemplate = require("../../views/admin/auth/signin");
const signupTemplate = require("../../views/admin/auth/signup");

// sub-router
const router = express();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email")
      .custom(async (email) => {
        const existingUser = await usersRepo.getOneBy({ email });
        if (existingUser) {
          throw new Error("Email in use");
        }
      }),
    check("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20 characters"),
    check("passwordConfirmation")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Must be between 4 and 20 characters")
      .custom((passwordConfirmation, { req }) => {
        if (req.body.password !== passwordConfirmation)
          throw new Error("Passwords must match");
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;

    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    // Store the ID of that user inside the users cookie
    req.session.userId = user.id;

    res.send("Account Created!!!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You have now signed out");
});

router.get("/signin", async (req, res) => {
  res.send(signinTemplate());
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  // Note that we are returning "early" from these if statements

  // Email check
  if (!user) return res.send(`Email not found`);

  // Password check
  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) return res.send("Invalid Password");

  req.session.userId = user.id;

  res.send("You are now signed in");
});

// Export router to index.js
module.exports = router;
