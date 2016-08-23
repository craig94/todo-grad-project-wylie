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

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
