// pajbqhTGE5nqwN9v
// mongodb+srv://Nata:pajbqhTGE5nqwN9v@cluster0.lngdnbv.mongodb.net/

// https://downloads.mongodb.com/compass/mongodb-compass-1.42.5-darwin-arm64.dmg
// mongodb+srv://Nata:pajbqhTGE5nqwN9v@cluster0.lngdnbv.mongodb.net

// mongodb+srv://Nata:<password>@cluster0.lngdnbv.mongodb.net/
// mongodb+srv://Nata:pajbqhTGE5nqwN9v@cluster0.lngdnbv.mongodb.net/contacts_reader?retryWrites=true&w=majority&appName=Cluster0
// npm install mongodb

const mongoose = require("mongoose");
const NODE_MONGOOSE =
  "mongodb+srv://Nata:pajbqhTGE5nqwN9v@cluster0.lngdnbv.mongodb.net/contacts_reader?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(NODE_MONGOOSE)
  .then(() => console.log("Database connect"))
  .catch((error) => console.log(error.message));
