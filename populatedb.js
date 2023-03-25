#! /usr/bin/env node

console.log(
  'This script populates some photo art products and their categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_application?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories.push(category);
  console.log(`Added category: ${name}`);
}

async function itemCreate(name, description, price, numberInStock, category) {
  itemdetail = {
    name: name,
    description: description,
    price: price,
    numberInStock: numberInStock,
  };
  if (category != false) itemdetail.category = category;

  const item = new Item(itemdetail);
  await item.save();
  items.push(item);
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding Categories");
  await Promise.all([
    categoryCreate(
      "DSLR Cameras",
      "High-quality digital single-lens reflex cameras for professional photographers"
    ),
    categoryCreate(
      "Camera Lenses",
      "A variety of lenses for different camera types and photography styles"
    ),
    categoryCreate(
      "Memory Cards",
      "Store your photos and videos with our range of memory cards"
    ),
    categoryCreate(
      "Photo Printers",
      "High-quality photo printers for stunning prints at home or in the studio"
    ),
    categoryCreate(
      "Photo Frames",
      "Display your cherished memories with our selection of frames and albums"
    ),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  await Promise.all([
    itemCreate(
      "Canon EOS 5D Mark IV",
      "30.4MP full-frame CMOS sensor DSLR camera with 4K video capability",
      2499,
      10,
      categories[0]
    ),
    itemCreate(
      "Sony Alpha a7 III Mirrorless Camera",
      "A full-frame mirrorless camera with 24.2MP, 4K video, and 5-axis in-body image stabilization",
      1799,
      8,
      categories[0]
    ),
    itemCreate(
      "Canon EOS R5 Mirrorless Camera",
      "A high-resolution full-frame mirrorless camera with 45MP, 8K video, and advanced autofocus system",
      3899,
      6,
      categories[0]
    ),
    itemCreate(
      "Sigma 35mm f/1.4 DG HSM Art Lens",
      "Wide-angle lens with a large aperture, ideal for landscape and street photography",
      799,
      15,
      categories[1]
    ),
    itemCreate(
      "Tamron 28-75mm f/2.8 Di III RXD for Sony E-mount",
      "A versatile, compact zoom lens for Sony E-mount cameras, with a constant f/2.8 aperture and fast, silent autofocus",
      879,
      10,
      categories[1]
    ),
    itemCreate(
      "Sigma 18-35mm f/1.8 DC HSM Art for Canon EF-mount",
      "A wide-angle to standard zoom lens with a constant f/1.8 aperture, designed for Canon APS-C DSLR cameras",
      799,
      7,
      categories[1]
    ),
    itemCreate(
      "SanDisk Extreme PRO 64GB SDXC UHS-I Memory Card",
      "A high-speed SD card with a 170MB/s read speed, ideal for shooting 4K video and high-resolution photos",
      29.99,
      22,
      categories[2]
    ),
    itemCreate(
      "SanDisk Extreme PRO 128GB SDXC UHS-I Memory Card",
      "A high-speed SD card with a 170MB/s read speed, ideal for shooting 4K video and high-resolution photos",
      49.99,
      35,
      categories[2]
    ),
    itemCreate(
      "SanDisk Extreme PRO 256GB SDXC UHS-I Memory Card",
      "A high-speed SD card with a 170MB/s read speed, ideal for shooting 4K video and high-resolution photos",
      89.99,
      14,
      categories[2]
    ),
    itemCreate(
      "Canon PIXMA PRO-100S Wireless Professional Inkjet Photo Printer",
      "A professional photo printer with 4800 x 2400 dpi resolution, 8-ink dye-based system, and Wi-Fi connectivity",
      399,
      5,
      categories[3]
    ),
    itemCreate(
      "Canon PIXMA PRO-300 Wireless Professional Inkjet Photo Printer",
      "A professional photo printer with 4800 x 2400 dpi resolution, 8-ink dye-based system, and Wi-Fi connectivity",
      299,
      19,
      categories[3]
    ),
    itemCreate(
      "Canon PIXMA PRO-1000 Wireless Professional Inkjet Photo Printer",
      "A professional photo printer with 4800 x 2400 dpi resolution, 8-ink dye-based system, and Wi-Fi connectivity",
      499,
      55,
      categories[3]
    ),

    itemCreate(
      "Canon 8x10 Photo Paper Plus Semi-Gloss 50 Sheets",
      "A pack of 50 sheets of semi-gloss photo paper, ideal for printing high-quality photos at home",
      19.99,
      21,
      categories[4]
    ),
    itemCreate(
      "Canon 8x10 Photo Paper Plus Glossy II 50 Sheets",
      "A pack of 50 sheets of glossy photo paper, ideal for printing high-quality photos at home",
      19.99,
      29,
      categories[4]
    ),
    itemCreate(
      "Canon 8x10 Photo Paper Plus Glossy II 100 Sheets",
      "A pack of 100 sheets of glossy photo paper, ideal for printing high-quality photos at home",
      29.99,
      2,
      categories[4]
    ),
  ]);
}
