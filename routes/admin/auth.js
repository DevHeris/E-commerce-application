const express = require("express");
const { check, validationResult } = require("express-validator");

const usersRepo = require("../../repositories/users");
const signinTemplate = require("../../views/admin/auth/signin");
const signupTemplate = require("../../views/admin/auth/signup");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
} = require("./validators");

// sub-router
const router = express();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) res.send(signupTemplate({ req, errors }));

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
