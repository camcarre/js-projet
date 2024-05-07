import express = require("express");
import { Server } from "socket.io";
import path = require("path");
import sqlite = require("sqlite3");

/* DB */

sqlite.verbose()
const db = new sqlite.Database("./db/chinook.db", sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

const app = express();
const io = new Server();

/* SERVER RUN */

const server = app.listen(3000, () => {
    console.log("Started server at ", server.address());
});
io.attach(server);

import livereload = require("livereload");
import connectLiveReload = require("connect-livereload");

if (process.env.NODE_ENV === 'development') {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 50);
    });
    app.use(connectLiveReload());
}

const staticPath = 'dist' ;

/* Client routes */

app.get("/", async (_, res) => {
    res.sendFile(process.cwd() + "/dist/pages/index.html");
});

app.get("/choice", (_, res) => {
    res.sendFile("/Users/camcam/Documents/taffpro/jsprojet/serveur ts/vite-multipage-ts-node-express-fullstack-template/choice.html");
});
app.get("/partieenligne.html", (_, res) => {
    res.sendFile("/Users/camcam/Documents/taffpro/jsprojet/serveur ts/vite-multipage-ts-node-express-fullstack-template/partieenligne.html");
});
app.get("/joinserveur.html", (_, res) => {
    res.sendFile("/Users/camcam/Documents/taffpro/jsprojet/serveur ts/vite-multipage-ts-node-express-fullstack-template/joinserveur.html");
});
app.get("/localserveur.html", (_, res) => {
    res.sendFile("/Users/camcam/Documents/taffpro/jsprojet/serveur ts/vite-multipage-ts-node-express-fullstack-template/localserveur.html");
});

app.use(express.static(path.join(process.cwd(), staticPath)));

interface Room {
    users: string[];
}
let rooms: Record<number, Room> = {};

app.get("/partieenligne.html", (_, res) => {
    let pin = Math.floor(1000 + Math.random() * 9000);
    rooms[pin] = { users: [] }; 
    res.redirect(`/join/${pin}`);
});



/* APIs */
 


app.get('/api/test', function (_, res) {
    let sql = "SELECT * FROM invoices";
    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 400, success: false, error: err });

            if (rows.length < 1) return res.json({ status: 400, success: false, error: "No match" });

            return res.json({ status: 200, data: rows, success: true});
        });
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        })
    }
    return
})

/* SOCKET IO */

io.on("connection", (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.slice(0,2)} said ${message}`);
    })
});


