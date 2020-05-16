const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

let notesData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));




app.get("/api/notes", function (err, res) {
  try {
    // Reads JSON file//
    notesData = fs.readFileSync("Develop/db/db.json", "utf8");

    // Parse notes to an array/
    notesData = JSON.parse(notesData);

  } catch (err) {
    console.log(err);
  }
  res.json(notesData);
});

//Writes note to JSON file//

app.post("/api/notes", function (req, res) {
  try {
    // reads the json file//
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    // console.log(notesData);

    notesData = JSON.parse(notesData);
    req.body.id = notesData.length;
    notesData.push(req.body);
    notesData = JSON.stringify(notesData);

    // writes new note to file//
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
      // error handling
      if (err) throw err;
    });
    res.json(JSON.parse(notesData));

  } catch (err) {
    throw err;
  }
});

// Delete a note

app.delete("/api/notes/:id", function (req, res) {
  try {
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    notesData = JSON.parse(notesData);
    //console.log(notesData)
    notesData = notesData.filter(function (note) {
      return note.id != req.params.id;
    });
    notesData = JSON.stringify(notesData);

    // write the new notes to the file
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function (err) {
      if (err) throw err;
    });

    res.send(JSON.parse(notesData));

  } catch (err) {
    throw err;
  }
});

// HTML GET //

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

//Default home//
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});

app.listen(PORT, function () {
  console.log("Server is listening on: " + PORT);
});
