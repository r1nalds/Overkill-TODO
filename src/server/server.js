const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

//Create a connection to the database
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "tododatabase",
});

//Apply CORS, BodyParser
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//API to get all the TODO items from the database
app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM todo_items";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//API to delete specific TODO item from the database
app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM todo_items WHERE id = ?";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: "Delete request was received" });
    }
  });
});

//API to add a new TODO item to the database
app.post("/api/insert", (req, res) => {
  const todoTitle = req.body.todoTitle;
  const todoDescription = req.body.todoDescription;
  const sqlInsert =
    "INSERT INTO todo_items (todoTitle, todoDesc) VALUES (?,?);";
  db.query(sqlInsert, [todoTitle, todoDescription], (err, result) => {
    if (err) console.log(err);
    if (result) console.log("Value has been added to the database", result);
    res.send("Value has been added to the database");
  });
});

//API to update a TODO item in the database
app.put("/api/update", (req, res) => {
  const id = req.body.id;
  const updatedDesc = req.body.updatedDesc;
  const sqlUpdate = "UPDATE todo_items SET todoDesc = ? WHERE id = ?";
  db.query(sqlUpdate, [updatedDesc, id], (err, result) => {
    if (err) console.log(err);
    if (result) console.log("Value has been updated in the database", result);
    res.send("Value has been updated in the database");
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
