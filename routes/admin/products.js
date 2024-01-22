const express = require("express");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const router = express.Router();

// Route to list all products
router.get("/admin/products", (req, res) => {});

// Route to create new product
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

module.exports = router;
