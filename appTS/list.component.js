"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var todo_1 = require("./todo");
var TodoService_1 = require("./TodoService");
var ListComponent = (function () {
    function ListComponent(service) {
        this.service = service;
        this.todos = [];
    }
    ListComponent.prototype.ngOnInit = function () {
        this.getTodos();
        this.filterStatus = "all";
    };
    ListComponent.prototype.getTodoList = function () {
        var todoList = [];
        for (var i = 0; i < this.todos.length; i++) {
            if (this.showTodo(this.todos[i])) {
                todoList.push(this.todos[i]);
            }
        }
        return todoList;
    };
    ListComponent.prototype.getTodos = function () {
        var _this = this;
        this.service.getTodos().then(function (result) { return _this.todos = result; });
    };
    ListComponent.prototype.createTodo = function (title) {
        var _this = this;
        var todo = new todo_1.Todo(title);
        this.service.createTodo(todo).then(function (result) { return _this.getTodos(); });
    };
    ListComponent.prototype.deleteTodo = function (id) {
        var _this = this;
        this.service.deleteTodo(id).then(function () { return _this.getTodos(); });
    };
    ListComponent.prototype.completeTodo = function (id) {
        var _this = this;
        this.service.completeTodo(id).then(function () { return _this.getTodos(); });
    };
    ListComponent.prototype.deleteComplete = function () {
        var _this = this;
        this.service.deleteComplete().then(function () { return _this.getTodos(); });
    };
    ListComponent.prototype.existsCompleteItem = function () {
        for (var i = 0; i < this.todos.length; i++) {
            if (this.todos[i].isComplete) {
                return true;
            }
        }
        return false;
    };
    ListComponent.prototype.itemsRemaining = function () {
        var count = 0;
        for (var i = 0; i < this.todos.length; i++) {
            if (!(this.todos[i].isComplete)) {
                count++;
            }
        }
        return count;
    };
    ListComponent.prototype.showTodo = function (todo) {
        if (this.filterStatus === "all" || (this.filterStatus === "complete" && todo.isComplete) || (this.filterStatus === "incomplete" && !todo.isComplete)) {
            return true;
        }
        return false;
    };
    ListComponent.prototype.all = function () {
        this.filterStatus = "all";
    };
    ListComponent.prototype.complete = function () {
        this.filterStatus = "complete";
    };
    ListComponent.prototype.incomplete = function () {
        this.filterStatus = "incomplete";
    };
    ListComponent = __decorate([
        core_1.Component({
            selector: "listDetail",
            templateUrl: "templates/listDetail.html"
        }), 
        __metadata('design:paramtypes', [TodoService_1.TodoService])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map