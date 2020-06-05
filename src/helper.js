const jsonParser = express.json();
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  text: String,
  title: String
});
const Note = mongoose.model("Note", noteSchema);

app.post("/notes", jsonParser, function (req, res) {
  const name = req.body.name;
  const title = req.body.title;
  const note = new Note({
    text: name,
    title: title
  });

  note.save(function (err, result) {
    if (err) return console.log(err);
    res.send(note);
  });
});

app.get("/notes/:id", (req, res) => {
  Note.findOne({
    _id: req.params.id
  }, function (err, note) {
    if (err) return console.log(err);
    res.send(note);
  });
});

app.delete("/notes/:id", (req, res) => {
  Note.deleteOne({
    _id: req.params.id
  }, function (err, note) {
    if (err) return console.log(err);
    res.send(note);
  });
});

app.put("/notes/:id", (req, res) => {
  const userName = req.body.title;
  const userAge = req.body.text;
  const newUser = {
    text: userAge,
    title: userName
  };

  Note.findOneAndUpdate({
      _id: req.params.id
    },
    newUser, {
      new: true,
      useFindAndModify: false
    },
    function (err, note) {
      if (err) return console.log(err);
      res.send(note);
    }
  );
});