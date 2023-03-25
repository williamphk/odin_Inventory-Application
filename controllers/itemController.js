const Item = require("../models/item");
const Category = require("../models/category");

exports.index = async (req, res) => {
  try {
    const [item_count, category_count] = await Promise.all([
      Item.countDocuments(),
      Category.countDocuments(),
    ]);

    res.render("index", {
      title: "Inventory Application Home",
      data: { item_count, category_count },
    });
  } catch (err) {
    res.render("index", {
      title: "Inventory Application Home",
      error: err,
      data: {},
    });
  }
};

// Display list of all Items
exports.item_list = async (req, res, next) => {
  try {
    const item_list = await Item.find({}, "name description category")
      .sort({ name: 1 })
      .populate("category");
    res.render("item_list", { title: "Item List", item_list });
  } catch (err) {
    next(err);
  }
};

// Display detail page for a specific Item
exports.item_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
};

// Display Item create form on GET
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display Item delete form on GET
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle Item delete on POST
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display Item update form on GET
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};
