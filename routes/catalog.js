const express = require("express");
const router = express.Router();

//Require controller modules
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

/// BOOK ROUTES ///

// GET catalog home page
router.get("/", item_controller.index);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id)
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item
router.post("/item/:id/update", item_controller.item_update_post);

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
router.get("/categorys", category_controller.category_list);

module.exports = router;
