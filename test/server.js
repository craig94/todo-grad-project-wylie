var server = require("../server/server");
var request = require("request");
var assert = require("chai").assert;

var testPort = 52684;
var baseUrl = "http://localhost:" + testPort;
var todoListUrl = baseUrl + "/api/todo";

describe("server", function() {
    var serverInstance;
    beforeEach(function() {
        serverInstance = server(testPort);
    });
    afterEach(function() {
        serverInstance.close();
    });
    describe("get list of todos", function() {
        it("responds with status code 200", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("responds with a body encoded as JSON in UTF-8", function(done) {
            request(todoListUrl, function(error, response) {
                assert.equal(response.headers["content-type"], "application/json; charset=utf-8");
                done();
            });
        });
        it("responds with a body that is a JSON empty array", function(done) {
            request(todoListUrl, function(error, response, body) {
                assert.equal(body, "[]");
                done();
            });
        });
    });
    describe("create a new todo", function() {
        it("responds with status code 201", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                assert.equal(response.statusCode, 201);
                done();
            });
        });
        it("responds with the location of the newly added resource", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function(error, response) {
                assert.equal(response.headers.location, "/api/todo/0");
                done();
            });
        });
        it("inserts the todo at the end of the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function() {
                request.get(todoListUrl, function(error, response, body) {
                    assert.deepEqual(JSON.parse(body), [{
                        title: "This is a TODO item",
                        isComplete: false,
                        id: "0"
                    }]);
                    done();
                });
            });
        });
    });
    describe("delete a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.del(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function() {
                request.del(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("removes the item from the list of todos", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function() {
                request.del(todoListUrl + "/0", function() {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), []);
                        done();
                    });
                });
            });
        });
    });
    describe("update a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.put(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200 if it exists", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item",
                }
            }, function() {
                request.put(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("successfully updates the todo with correct title", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "This is a TODO item"
                }
            }, function() {
                request.put({
                    url: todoListUrl + "/0",
                    json: {
                        title: "lol"
                    }
                }, function() {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), [{title : "lol", id : "0", isComplete: false}]);
                        done();
                    });
                });
            });
        });
    });
    describe("complete a todo", function() {
        it("responds with status code 404 if there is no such item", function(done) {
            request.put(todoListUrl + "/0", function(error, response) {
                assert.equal(response.statusCode, 404);
                done();
            });
        });
        it("responds with status code 200 if it exists", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "Item"
                }
            }, function() {
                request.put(todoListUrl + "/0", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("successfully completes the todo and does not update invalid attributes", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "Item"
                }
            }, function() {
                request.put({
                    url: todoListUrl + "/0",
                    json: {
                        isComplete: true,
                        randomAttribute: "lol"
                    }
                }, function() {
                    request.get(todoListUrl, function(error, response, body) {
                        assert.deepEqual(JSON.parse(body), [{title : "Item", id : "0", isComplete: true}]);
                        done();
                    });
                });
            });
        });
    });
    describe("delete all completed todos", function() {
        it("responds with status code 200 if no items in list", function(done) {
            request.post(todoListUrl + "/delete/", function(error, response) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });
        it("delete request with no complete items", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "Item"
                }
            }, function() {
                request.post(todoListUrl + "/delete/", function(error, response) {
                    assert.equal(response.statusCode, 200);
                    done();
                });
            });
        });
        it("delete 1 completed item, leave the other incomplete item", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "Item 1"
                }
            }, function() {
                request.post({
                    url: todoListUrl,
                    json: {
                        title: "Item 2"
                    }
                }, function () {
                    request.put({
                        url: todoListUrl + "/1",
                        json: {
                            isComplete: true,
                        }
                    }, function() {
                        request.post({
                            url: todoListUrl + "/delete/",
                        }, function () {
                            request.get(todoListUrl, function(error, response, body) {
                                assert.deepEqual(JSON.parse(body), [{title : "Item 1", id : "0", isComplete: false}]);
                                done();
                            });
                        });
                    });
                });
            });
        });
        it("deletes multiple completed items", function(done) {
            request.post({
                url: todoListUrl,
                json: {
                    title: "Item 1"
                }
            }, function() {
                request.post({
                    url: todoListUrl,
                    json: {
                        title: "Item 2"
                    }
                }, function () {
                    request.post({
                        url: todoListUrl,
                        json: {
                            title: "Item 3"
                        }
                    }, function () {
                        request.put({
                            url: todoListUrl + "/1",
                            json: {
                                isComplete: true,
                            }
                        }, function() {
                            request.put({
                                url: todoListUrl + "/0",
                                json: {
                                    isComplete: true,
                                }
                            }, function () {
                                request.post({
                                    url: todoListUrl + "/delete/",
                                }, function () {
                                    request.get(todoListUrl, function(error, response, body) {
                                        assert.deepEqual(JSON.parse(body),
                                        [{title : "Item 3", id : "2", isComplete: false}]);
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    describe("server polling", function() {
        it("responds with status code 200 and latestID = 0", function(done) {
            request.get(todoListUrl + "/update/", function(error, response, body) {
                assert.equal(response.statusCode, 200);
                assert.equal(Number(response.body), 0);
                done();
            });
        });
    });
});
