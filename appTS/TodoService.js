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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var TodoService = (function () {
    function TodoService(http) {
        this.http = http;
        this.url = "/api/todo";
    }
    TodoService.prototype.getTodos = function () {
        return this.http.get(this.url)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    TodoService.prototype.createTodo = function (todo) {
        var headers = new http_1.Headers({
            "Content-Type": "application/json" });
        return this.http.post(this.url, JSON.stringify(todo), { headers: headers })
            .toPromise()
            .then(function (result) { return result; })
            .catch(this.handleError);
    };
    TodoService.prototype.deleteTodo = function (id) {
        var deleteUrl = this.url + "/" + id;
        return this.http.delete(deleteUrl)
            .toPromise()
            .catch(this.handleError);
    };
    TodoService.prototype.completeTodo = function (id) {
        var completeUrl = this.url + "/" + id;
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        return this.http.put(completeUrl, JSON.stringify({ "id": id, "isComplete": true }), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    };
    TodoService.prototype.deleteComplete = function () {
        var deleteUrl = this.url + "/delete";
        var headers = new http_1.Headers({
            "Content-Type": "application/json" });
        return this.http.post(deleteUrl, JSON.stringify({}), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    };
    TodoService.prototype.checkUpdate = function () {
        var updateUrl = this.url + "/update";
        return this.http.get(updateUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    TodoService.prototype.handleError = function (error) {
        return Promise.reject(error.message || error);
    };
    TodoService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
//# sourceMappingURL=TodoService.js.map