const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "category" },
});

//Virtual for book's URL
ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
