const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 8080;

const notes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

//API routes
app.get("/api/notes", (req, res) => {
    console.log("loading stuff")
    return res.json(notes)
})

app.post("/api/notes", (req, res) => {
    // console.log(req)
    console.log(req.body)
    req.body["id"] = Math.floor(Math.random() * 1000000000)
    notes.push(req.body)
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if(err) throw err;
        return res.json(req.body)
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let idToDelete = req.params.id

    for(i=0;i<notes.length;i++){
        if(idToDelete == notes[i].id){
            notes.splice(i, 1);
        }
    }

    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if(err) throw err;
        return res.json(req.body)
    })
})

//Catch All Route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.listen(PORT, function(){
    console.log("Still Livin'")
})