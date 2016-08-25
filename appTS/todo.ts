export class Todo {
    title: string;
    isComplete: boolean;
    id: string;

    constructor(title: string) {
        this.title = title;
        this.isComplete = false;
    }
}
