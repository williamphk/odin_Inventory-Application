const Item = require("../models/item");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");

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
    const item_list = await Item.find({}, "name category")
      .sort({ name: 1 })
      .populate("category");
    res.render("item_list", { title: "Item List", item_list });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific Item
exports.item_detail = async (req, res, next) => {
  try {
    const item_detail = await Item.findById(req.params.id).populate("category");
    res.render("item_detail", { title: "Item Detail", item_detail });
  } catch (err) {
    return next(err);
  }
};

// Display Item create form on GET
exports.item_create_get = async (req, res, next) => {
  try {
    const categories = await Category.find({}, "name");
    res.render("item_form", { title: "Create Item", categories });
  } catch (err) {
    return next(err);
  }
};

// Handle Item create on POST
exports.item_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("numberInStock", "Number in stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category").escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      category: req.body.category,
    });

    // Check if there are errors.
    if (!errors.isEmpty()) {
      try {
        // Get all category for form.
        const categories = await Category.find();

        // Mark the selected category as checked to preserve the user's previous selection.
        for (const category of categories) {
          if (item.category.equals(category._id)) {
            category.checked = "true";
          }
        }
        res.render("item_form", {
          title: "Create Item",
          categories,
          item,
          errors: errors.array(),
        });
      } catch (err) {
        // There are errors. Render form again with sanitized values/error messages.
        return next(err);
      }
      return;
    }

    // Data from form is valid. Save item.
    try {
      await item.save();
      // Successful: redirect to new item record.
      res.redirect(item.url);
    } catch (err) {
      return next(err);
    }
  },
];

// Display Item delete form on GET
exports.item_delete_get = async (req, res, next) => {
  try {
    const item_delete = await Item.findById(req.params.id);

    if (item_delete == null) {
      // No results.
      res.redirect("/catalog/items");
    }
    // Successful, so render.
    res.render("item_delete", { title: "Delete Item", item_delete });
  } catch (err) {
    return next(err);
  }
};

// Handle Item delete on POST
exports.item_delete_post = async (req, res, next) => {
  try {
    const item_delete = await Item.findById(req.params.id);

    if (item_delete == null) {
      // No results.
      res.redirect("/catalog/items");
    } else {
      // Successful, so remove the item and redirect.
      await Item.deleteOne({ _id: req.params.id });
      res.redirect("/catalog/items");
    }
  } catch (err) {
    return next(err);
  }
};

// Display Item update form on GET
exports.item_update_get = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");
    const categories = await Category.find();

    if (item == null) {
      // No results.
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }

    // Mark the selected category as checked to preserve the user's previous selection.
    for (const category of categories) {
      if (item.category.equals(category._id)) {
        category.checked = "true";
      }
    }

    // Success.
    res.render("item_form", { title: "Update Item", item, categories });
  } catch (err) {
    return next(err);
  }
};

// Handle Item update on POST
exports.item_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("numberInStock", "Number in stock must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category").escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
      category: req.body.category,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    // Check if there are errors.
    if (!errors.isEmpty()) {
      try {
        // Get all category for form.
        const categories = await Category.find();

        // Mark the selected category as checked to preserve the user's previous selection.
        for (const category of categories) {
          if (item.category.equals(category._id)) {
            category.checked = "true";
          }
        }
        res.render("item_form", {
          title: "Update Item",
          categories,
          item,
          errors: errors.array(),
        });
      } catch (err) {
        // There are errors. Render form again with sanitized values/error messages.
        return next(err);
      }
      return;
    }

    // Data from form is valid. Save item.
    try {
      await Item.updateOne({ _id: req.params.id }, item);
      // Successful: redirect to new item record.
      res.redirect(item.url);
    } catch (err) {
      return next(err);
    }
  },
];
