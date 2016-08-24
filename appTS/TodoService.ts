import { Injectable } from '@angular/core';
import { Todo } from './Todo';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TodoService {
    constructor (private http: Http) {}

    private url = "/api/todo";

    getTodos(): Promise<Todo[]> {
        return this.http.get(this.url)
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
    }

    createTodo(todo: Todo): Promise<any> {
        let headers = new Headers( {
            "Content-Type": "application/json"});

        return this.http.post(
            this.url, JSON.stringify(todo), {headers: headers})
            .toPromise()
            .then(result => result)
            .catch(this.handleError);
    }

    deleteTodo(id: string): Promise<any> {
        let deleteUrl = this.url + "/" + id;

        return this.http.delete(
            deleteUrl)
            .toPromise()
            .catch(this.handleError);
    }

    completeTodo(id: string): Promise<any> {
        let completeUrl = this.url + "/" + id;
        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        return this.http.put(
            completeUrl, JSON.stringify({"id": id, "isComplete": true}), {headers: headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    deleteComplete(): Promise<any> {
        let deleteUrl = this.url + "/delete";
        let headers = new Headers( {
            "Content-Type": "application/json"});

        return this.http.post(
            deleteUrl, JSON.stringify({}), {headers: headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
