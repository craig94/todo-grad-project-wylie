import { Component } from '@angular/core';
import { Todo } from "./todo";
import { TodoService } from "./TodoService";
import { OnInit } from "@angular/core";

@Component({
    selector: "listDetail",
    templateUrl: "templates/listDetail.html"
})
export class ListComponent implements OnInit {
    todos = [];

    constructor (private service: TodoService) {}

    ngOnInit(): void {
        this.getTodos();
    }

    getTodos() {
        this.service.getTodos().then(
            result => this.todos = result
        );
    }

    createTodo(title: string) {
        let todo = new Todo(title);
        this.service.createTodo(todo).then(
            result => this.getTodos()
        );
    }
}
