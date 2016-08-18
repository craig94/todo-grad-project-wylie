var todoList = document.getElementById("todo-list");
var todoListPlaceholder = document.getElementById("todo-list-placeholder");
var form = document.getElementById("todo-form");
var todoTitle = document.getElementById("new-todo");
var error = document.getElementById("error");
var countLabel = document.getElementById("count-label");
var filterList = document.getElementById("filter-label");
var filterFlag = "";
var all;
var complete;
var incomplete;

form.onsubmit = function(event) {
    var title = todoTitle.value;
    createTodo(title, function() {
        reloadTodoList();
    });
    todoTitle.value = "";
    event.preventDefault();
};

function createTodo(title, callback) {
    fetch("/api/todo/", {
        method: "post",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            title: title
        })})
    .then(function(response) {
        if (response.status === 201) {
            callback();
        } else {
            error.textContent = "Failed to create item. Server returned " +
            response.status + " - " + response.statusText;
        }
    }).catch(function(error) {
        console.log("request failed", error);
    });
}

function getTodoList(callback) {
    fetch("/api/todo/")
    .then(function(response) {
        if (response.status === 200) {
            response.json().then(function(data) {
            callback(data);
        });
        } else {
            error.textContent = "Failed to get list. Server returned " +
            response.status + " - " + response.statusText;
        }
    }).catch(function(error) {
        console.log("request failed", error);
    });
}

function deleteTodoItem() {
    fetch("/api/todo/" + this.getAttribute("actualID"), {
        method: "delete"})
    .then(function(response) {
        if (response.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete item. Server returned " +
            response.status + " - " + response.statusText;
        }
    }).catch(function(error) {
        console.log("request failed", error);
    });
}

function completeFunc() {
    fetch("/api/todo/" + this.getAttribute("actualID"), {
        method: "put",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            isComplete: true
        })})
    .then(function(response) {
        if (response.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to create item. Server returned " +
            response.status + " - " + response.statusText;
        }
    }).catch(function(error) {
        console.log("Request failed", error);
    });
}

function deleteCompleted() {
    fetch("/api/todo/delete/", {
        method: "post",
        headers: {"Content-type": "application/json"}})
    .then(function(response) {
        if (response.status === 200) {
            reloadTodoList();
        } else {
            error.textContent = "Failed to delete item. Server returned " +
            response.status + " - " + response.statusText;
        }
    }).catch(function(error) {
        console.log("Request failed", error);
    });
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
