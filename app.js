const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const exhbs = require("express-handlebars");
const dbo = require("./db");
const ObjectId = dbo.ObjectId;

// Middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.engine(
  "hbs",
  exhbs.engine({
    layoutsDir: "views/",
    defaultLayout: "main", // Assuming you have views/main.hbs
    extname: "hbs",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

// Route
app.get("/", async (req, res) => {
  let database = await dbo.getdatabase();
  const collection = database.collection("players");
  const players = await collection.find({}).toArray();

  let message = "";
  let edit_id, edit_players;

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_players = await collection.findOne({ _id: new ObjectId(edit_id) });
  }

  if (req.query.delete_id) {
    await collection.deleteOne({ _id: new ObjectId(req.query.delete_id) });
    return res.redirect("/?status=3");
  }

  switch (req.query.status) {
    case "1":
      message = "ok lets gooooo";
      break;
    case "2":
      message = "it's editeddedee";
      break;
    case "3":
      message = "it's deleted";
      break;
    default:
      break;
  }
  res.render("main", { message, players, edit_id, edit_players });
});

app.post("/store_players", async (req, res) => {
  let database = await dbo.getdatabase();
  const collection = database.collection("players");
  let players = {
    name: req.body.name,
    age: req.body.age,
  };
  await collection.insertOne(players);
  return res.redirect("/?status=1");
});

app.post("/update_players", async (req, res) => {
  let database = await dbo.getdatabase();
  const collection = database.collection("players");
  let players = {
    name: req.body.name,
    age: req.body.age,
  };
  let edit_id = req.body.edit_id;
  console.log("Edit ID:", edit_id); 
  if (!edit_id) {
    return res.redirect("/?status=error");
  }
  await collection.updateOne({ _id: new ObjectId(edit_id) }, { $set: players });
  return res.redirect("/?status=2");
});

// Server Start
app.listen(8000, () => {
  console.log("🚀 Listening on port 8000");
});
