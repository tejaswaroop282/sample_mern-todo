const mongoose = require("mongoose");
const { createApp } = require("./app");

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    createApp().listen(port, () => console.log(`API listening on ${port}`));
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
