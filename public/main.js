var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        title: title
    }));
    createRequest.onload = function() {
        if (this.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function getTodoList(callback) {
    var createRequest = new XMLHttpRequest();
    createRequest.open("GET", "/api/todo");
    createRequest.onload = function() {
        if (this.status === 200) {
            callback(JSON.parse(this.responseText));
        } else {
            error.textContent = "Failed to get list. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

function deleteTodoItem() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("DELETE", "/api/todo/" + this.getAttribute("actualID"));
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete item. Server returned " + this.status + " - " + this.responseText;
        }
    };
    createRequest.send();
}

var getButton = function(text, id, actualID, func) {
    var button = document.createElement("BUTTON");
    var buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
    button.setAttribute("id", id);
    button.setAttribute("actualID", actualID);
    button.onclick = func;
    return button;
};

function completeFunc() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("PUT", "/api/todo/" + this.getAttribute("actualID"));
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send(JSON.stringify({
        isComplete: true
    }));
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to update item. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function deleteCompleted() {
    var createRequest = new XMLHttpRequest();
    createRequest.open("POST", "/api/todo/delete/");
    createRequest.setRequestHeader("Content-type", "application/json");
    createRequest.send();
    createRequest.onload = function() {
        if (this.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete completed items. Server returned " + this.status + " - " + this.responseText;
        }
    };
}

function updateCountLabel(count) {
    countLabel.innerHTML = count + " items remaining";
}

function reloadTodoList() {
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    todoListPlaceholder.style.display = "block";
    getTodoList(function(todos) {
        var count = 0;
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            var listItem = document.createElement("li");
            listItem.textContent = todo.title;
            listItem.appendChild(getButton("DELETE", ("delete" + todo.id), todo.id, deleteTodoItem));
            var completeButton = getButton("COMPLETE", ("complete" + todo.id), todo.id, completeFunc);
            if (todo.isComplete) {
                listItem.style.color = "red";
            } else {
                count++;
            }
            listItem.appendChild(completeButton);
            todoList.appendChild(listItem);
        });
        updateCountLabel(count);
        if (count !== todos.length) {
            var deleteCompletedButton = getButton("DELETE COMPLETED", "dc", "dc", deleteCompleted);
            todoList.appendChild(deleteCompletedButton);
        }
    });
}

reloadTodoList();
