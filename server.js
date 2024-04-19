const mongoose = require("mongoose");

const app = require("./app");
const { error } = require("console");
const NODE_MONGOOSE =
  "mongodb+srv://Nata:pajbqhTGE5nqwN9v@cluster0.lngdnbv.mongodb.net/contacts_reader?retryWrites=true&w=majority&appName=Cluster0";

mongoose.set("strictQuery", true);
mongoose
  .connect(NODE_MONGOOSE)
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
