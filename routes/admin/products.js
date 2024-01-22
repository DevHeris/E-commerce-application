const express = require("express");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const router = express.Router();

const { requireTitle, requirePrice } = require("./validators");
const { validationResult } = require("express-validator");

// Route to list all products
router.get("/admin/products", (req, res) => {});

// Route to create new product
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  res.send("Submitted");
});

module.exports = router;
