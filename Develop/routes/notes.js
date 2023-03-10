const notes = require('express').Router();
const fs = require("fs");
const uuid = require("../helpers/uuid");

notes.get("/", (req, res) => {
    fa.readFile('.db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.json([]);
        } else {
            const parsedNotes = JSON.parse(data);
            return res.json(parsedNotes);
        }
    });
});

notes.post("/", (req, res) => {
    const { title, text} = req.body;
    if (title && text) {
        const newNote = {
            title, 
            text, 
            note_id: uuid(),
        };
        const noteString = JSON.stringify(newNote);
        fs.readFile('.db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);
                fs.writeFile(
                    '.db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    :console.log("notes updated successfully!")
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Posting note error');
    }
});

notes.delete("/:id", (req, res) => {
    var id = req.params.id
    console.log(id)
    fs.readFile('.db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let parsedNotes = JSON.parse(data);
            parsedNotes = parsedNotes.filter((note) => {
                return note.note_id === id;
            });
            
            fa.writeFile(
                '.db/db.json',
                JSON.stringify(parsedNotes, null, 4), 
                (writeErr) =>
                writeErr
                ? console.error(writeErr)
                : console.log("note deleted successfully!")
            );
        };
        
    })
})

module.exports = notes;

