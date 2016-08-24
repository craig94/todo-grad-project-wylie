import { Component } from "@angular/core";
import { Todo } from "./todo";
import { TodoService } from "./TodoService";
import { OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";

@Component({
    selector: "listDetail",
    templateUrl: "templates/listDetail.html"
})
export class ListComponent implements OnInit {
    todos = [];
    filterStatus: string;
    private clientUpdateID: number;
    pageLoaded = false;
    errorText: string;

    constructor (private service: TodoService) {}

    ngOnInit(): void {
        this.all();
        this.getTodos();
        let timer = Observable.timer(5000,5000);
        timer.subscribe(t => this.timerFunc());
        this.clientUpdateID = 0;
        this.pageLoaded = true;
        this.errorText = "";
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
        ).catch(
            error => this.errorText = "Request failed, error:\t" + error
        );
    }

    createTodo(title: string) {
        let todo = new Todo(title);
        this.service.createTodo(todo).then(
            result => this.getTodos()
        ).catch(
            error => this.errorText = "Request failed, error:\t" + error
        );
        this.clientUpdateID++;
    }

    deleteTodo(id: string) {
        this.service.deleteTodo(id).then(
            () => this.getTodos()
        ).catch(
                error => this.errorText = "Request failed, error:\t" + error
            );
        this.clientUpdateID++;
    }

    completeTodo(id: string) {
        this.service.completeTodo(id).then(
            () => this.getTodos()
        ).catch(
            error => this.errorText = "Request failed, error:\t" + error
        );
        this.clientUpdateID++;
    }

    deleteComplete() {
        this.service.deleteComplete().then(
            () => this.getTodos()
        ).catch(
            error => this.errorText = "Request failed, error:\t" + error
        );
        this.clientUpdateID++;
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
        if (this.filterStatus === "All" || (this.filterStatus === "Complete" && todo.isComplete) || (this.filterStatus === "Incomplete" && !todo.isComplete)) {
            return true;
        }
        return false;
    }

    all(): void {
        this.filterStatus = "All";
    }

    complete(): void {
        this.filterStatus = "Complete";
    }

    incomplete(): void {
        this.filterStatus = "Incomplete";
    }

    timerFunc(): void {
        this.service.checkUpdate().then(
            serverUpdateID => {
                if (Number(serverUpdateID) !== this.clientUpdateID) {
                    this.clientUpdateID = Number(serverUpdateID);
                    this.getTodos();
                }
            }
        );
    }
}
