var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");
var filterList = document.getElementById("filter-label");
var filterFlag = "";
var all, complete, incomplete;

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
    button.setAttribute("class", "button");
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
            error.textContent = "Failed to delete completed items. Server returned " +
            this.status + " - " + this.responseText;
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
        var completeCount = 0;
        var incompleteCount = 0;
        todoListPlaceholder.style.display = "none";
        todos.forEach(function(todo) {
            if (checkFilter(todo)) {
                var listItem = getListItem(todo);
                if (todo.isComplete) {
                    listItem.style.color = "red";
                    completeCount++;
                } else {
                    incompleteCount++;
                }
                todoList.appendChild(listItem);
            }
        });
        updateCountLabel(incompleteCount);
        if (completeCount > 0) {
            var deleteCompletedButton = getButton("DELETE COMPLETED", "dc", "dc", deleteCompleted);
            todoList.appendChild(deleteCompletedButton);
        }
        if (todos.length > 0) {
            appendFilterButtons();
        } else {
            removeFilterButtons();
        }
    });
}

function getListItem(todo) {
    var listItem = document.createElement("li");
    listItem.textContent = todo.title;
    listItem.appendChild(getButton("DELETE", ("delete" + todo.id), todo.id, deleteTodoItem));
    var completeButton = getButton("COMPLETE", ("complete" + todo.id), todo.id, completeFunc);
    listItem.appendChild(completeButton);
    return listItem;
}

function appendFilterButtons() {
    if (filterList.childNodes.length === 0) {
        document.getElementById("filter-text").innerHTML = "Filter By:\tALL";
        all = getButton("ALL", "all", "all", allButton);
        complete = getButton("COMPLETE", "complete", "complete", completeButton);
        incomplete = getButton("INCOMPLETE", "incomplete", "incomplete", incompleteButton);

        filterList.appendChild(all);
        filterList.appendChild(complete);
        filterList.appendChild(incomplete);
    }
}

function removeFilterButtons() {
    document.getElementById("filter-text").innerHTML = "";
    while (filterList.firstChild) {
        filterList.removeChild(filterList.firstChild);
    }
}

function checkFilter(todo) {
    if (!filterFlag) {
        return true;
    }
    if ((todo.isComplete && filterFlag === "complete") || (!todo.isComplete && filterFlag === "incomplete")) {
        return true;
    }
    return false;
}

function allButton() {
    filterFlag = "";
    reloadTodoList();
    document.getElementById("filter-text").innerHTML = "Filter By:\tALL";
}

function completeButton() {
    filterFlag = "complete";
    reloadTodoList();
    document.getElementById("filter-text").innerHTML = "Filter By:\tCOMPLETE";
}

function incompleteButton() {
    filterFlag = "incomplete";
    reloadTodoList();
    document.getElementById("filter-text").innerHTML = "Filter By:\tINCOMPLETE";
}

reloadTodoList();
