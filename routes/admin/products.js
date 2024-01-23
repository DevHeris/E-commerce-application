// External libraries
const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
// upload is a middleware
const upload = multer({ storage: multer.memoryStorage() });

// Route to list all products
router.get("/admin/products", (req, res) => {});

// Route to create new product
router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  // This particular order is very important (i.e the array shouldn't come before the upload(multer) middleware)
  upload.single("image"),
  [requireTitle, requirePrice],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) return res.send(productsNewTemplate({ errors }));

    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.send("Submitted");
  }
);

module.exports = router;
