const express = require("express");
const app = express();
const mongoose = require("mongoose");
const parameter_controller = require("./parameter_controller")
const body_parser = require("body-parser");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8081;

app.use(body_parser.json());
app.use(express.static("public"));

// REST API
app.post("/api/add_tool", parameter_controller.api_post_parameter);
app.get("/api/all_parameters", parameter_controller.api_get_parameter_sets);
app.get("/api/tool_parameter/:id", parameter_controller.api_get_parameter);
app.put("/api/tool_parameter/:id", parameter_controller.api_put_parameter);
app.delete("/api/tool_parameter/:id", parameter_controller.api_delete_parameter);

const db_uri = "mongodb+srv://db_admin:admin@cluster0.t9nub.mongodb.net/mc-parameter-handler-db?retryWrites=true&w=majority";


// WEB SOCKET
let connections = [];

function broadcast_parameters_created(message){
    for(let id in connections){
        const socket = connections[id];
        socket.emit("tool_parameters_created", message);
        console.log(message);
    }
};

function broadcast_parameter_change(message){
    for(let id in connections){
        const socket = connections[id];
        socket.emit("tool_parameters_changed", message);
        console.log(message);
    }
};

function broadcast_parameter_deleted(message){
    for(let id in connections){
        const socket = connections[id];
        socket.emit("tool_parameters_deleted", message);
        console.log(message);
    }
};

io.on('connection', (socket) => {
    connections[socket.id] = socket;
    console.log("Client connected");
    
    socket.on('disconnect', (socket) => {
        delete connections[socket.id];
        console.log("Cliend disconnected");
    });
});

// MongoDB connection
mongoose.connect(db_uri, {}).then(() => {
    console.log("db connected");
    console.log("listening ports: ", PORT);
    //app.listen(PORT_APP);
    server.listen(PORT);
});

module.exports.broadcast_parameters_created = broadcast_parameters_created;
module.exports.broadcast_parameter_change = broadcast_parameter_change;
module.exports.broadcast_parameter_deleted = broadcast_parameter_deleted;
