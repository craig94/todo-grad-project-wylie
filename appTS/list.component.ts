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
    filterStatus: string;

    constructor (private service: TodoService) {}

    ngOnInit(): void {
        this.getTodos();
        this.filterStatus = "all";
    }

    getTodoList(): Todo[] {
        let todoList = [];
        for (let i=0;i<this.todos.length;i++) {
            if (this.showTodo(this.todos[i])) {
                todoList.push(this.todos[i]);
            }
        }
        return todoList;
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

    deleteTodo(id: string) {
        this.service.deleteTodo(id).then(
            () => this.getTodos()
        );
    }

    completeTodo(id: string) {
        this.service.completeTodo(id).then(
            () => this.getTodos()
        );
    }

    deleteComplete() {
        this.service.deleteComplete().then(
            () => this.getTodos()
        );
    }

    existsCompleteItem(): boolean {
        for (let i=0;i<this.todos.length;i++){
            if (this.todos[i].isComplete) {
                return true;
            }
        }
        return false;
    }

    itemsRemaining(): number {
        let count = 0;
        for (let i=0;i<this.todos.length;i++) {
            if (!(this.todos[i].isComplete)) {
                count++;
            }
        }
        return count;
    }

    showTodo(todo: Todo): boolean {
        if (this.filterStatus === "all" || (this.filterStatus === "complete" && todo.isComplete) || (this.filterStatus === "incomplete" && !todo.isComplete)) {
            return true;
        }
        return false;
    }

    all(): void {
        this.filterStatus = "all";
    }

    complete(): void {
        this.filterStatus = "complete";
    }

    incomplete(): void {
        this.filterStatus = "incomplete";
    }
}
