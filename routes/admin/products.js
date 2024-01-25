// External libraries
const express = require("express");
const { handleErrors, requireAuth } = require("./middlewares");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
// upload is a middleware
const upload = multer({ storage: multer.memoryStorage() });

// Route to list all products
router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

// Route to create new product
router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth,
  // This particular order is very important (i.e the array shouldn't come before the upload(multer) middleware)
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", async (req, res) => {
  const product = productsRepo.getOne(req.params.id);

  if (!product) return res.send("Product not found");
});

module.exports = router;
