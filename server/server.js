var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");

module.exports = function(port, middleware, callback) {
    var app = express();

    if (middleware) {
        app.use(middleware);
    }
    app.use(express.static("public"));
    app.use(bodyParser.json());

    var latestId = 0;
    var todos = [];

    // delete completed todos
    app.post("/api/todo/delete/", function(req, res) {
        deleteCompleted();
        res.sendStatus(200);
    });

    // Create
    app.post("/api/todo/", function(req, res) {
        var todo = req.body;
        todo.id = latestId.toString();
        latestId++;
        todo.isComplete = false;
        todos.push(todo);
        res.set("Location", "/api/todo/" + todo.id);
        res.sendStatus(201);
    });

    // Read
    app.get("/api/todo", function(req, res) {
        res.json(todos);
    });

    // Delete
    app.delete("/api/todo/:id", function(req, res) {
        var id = req.params.id;
        var todo = getTodo(id);
        if (todo) {
            todos = todos.filter(function(otherTodo) {
                return otherTodo !== todo;
            });
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    //update
    app.put("/api/todo/:id", function(req, res) {
        var id = req.params.id;
        var todo = getTodo(id);
        var safeAttributes = ["isComplete", "title"];
        if (todo) {
            for (var i in req.body) {
                if (safeAttributes.indexOf(i) !== -1) {
                    todo[i] = req.body[i];
                }
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    function getTodo(id) {
        return _.find(todos, function(todo) { return todo.id === id;});
    }

    function deleteCompleted() {
        for (var i=todos.length-1;i>=0;i--){
            if (todos[i].isComplete) {
                todos.splice(i,1);
            }
        }
    }

    var server = app.listen(port, callback);

    // We manually manage the connections to ensure that they're closed when calling close().
    var connections = [];
    server.on("connection", function(connection) {
        connections.push(connection);
    });

    return {
        close: function(callback) {
            connections.forEach(function(connection) {
                connection.destroy();
            });
            server.close(callback);
        }
    };
};
