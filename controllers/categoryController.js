const Category = require("../models/category");

const { body, validationResult } = require("express-validator");

// Display list of all Categorys
exports.category_list = async (req, res, next) => {
  try {
    const category_list = await Category.find({}, "name description").sort({
      name: 1,
    });
    res.render("category_list", { title: "Category List", category_list });
  } catch (err) {
    return next(err);
  }
};

// Display detail page for a specific Category
exports.category_detail = async (req, res, next) => {
  try {
    const category_detail = await Category.findById(req.params.id);
    res.render("category_detail", {
      title: "Category Detail",
      category_detail,
    });
  } catch (err) {
    return next(err);
  }
};

// Display Category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST
exports.category_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", { category, errors: errors.array() });
    }
    try {
      await category.save();
      res.redirect(category.url);
    } catch (err) {
      return next(err);
    }
  },
];

// Display Category delete form on GET
exports.category_delete_get = async (req, res, next) => {
  try {
    const category_delete = await Category.findById(req.params.id);
    if (category_delete == null) {
      res.redirect("/catalog/categories");
    }
    res.render("category_delete", {
      title: "Delete Category",
      category_delete,
    });
  } catch (err) {
    next(err);
  }
};

// Handle Category delete on POST
exports.category_delete_post = async (req, res, next) => {
  try {
    const category_delete = await Category.findById(req.params.id);
    if (category_delete == null) {
      res.redirect("/catalog/categories");
    }
    await Category.deleteOne({ _id: req.params.id });
    res.redirect("/catalog/categories");
  } catch (err) {
    next(err);
  }
};

// Display Category update form on GET
exports.category_update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      const err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    res.render("category_form", { title: "Update Category", category });
  } catch (err) {
    return next(err);
  }
};

// Handle Category update on POST
exports.category_update_post = [
  (body("name", "Name must not be empty.").trim().isLength({ min: 1 }),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("category_form", { title: "Update Category", category });
    }

    try {
      await Category.updateOne({ _id: req.params.id }, category);
      res.redirect(category.url);
    } catch (err) {
      return next(err);
    }
  }),
];
