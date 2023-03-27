const express = require("express");
const router = express.Router();

const path = require("path");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

//Require controller modules
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/// BOOK ROUTES ///

// GET catalog home page
router.get("/", item_controller.index);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id)
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item
router.post(
  "/item/create",
  upload.single("image"),
  item_controller.item_create_post
);

// Serve the static files in the 'uploads' folder
const uploadsPath = path.join(__dirname, "..", "uploads");
router.use("/uploads", express.static(uploadsPath));

// GET request to delete Item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item
router.post(
  "/item/:id/update",
  upload.single("image"),
  item_controller.item_update_post
);

// GET request for one Item
router.get("/item/:id", item_controller.item_detail);

// Get request for list of all Item items
router.get("/items", item_controller.item_list);

/// GENRE ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category.
router.get("/categories", category_controller.category_list);

module.exports = router;
