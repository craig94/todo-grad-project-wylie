var testing = require("selenium-webdriver/testing");
var assert = require("chai").assert;
var helpers = require("./e2eHelpers");

testing.describe("end to end", function() {
    this.timeout(20000);
    testing.before(helpers.setupDriver);
    testing.beforeEach(helpers.setupServer);
    testing.afterEach(helpers.teardownServer);
    testing.after(function() {
        helpers.teardownDriver();
        //helpers.reportCoverage();
    });

    testing.describe("on page load", function() {
        testing.it("displays TODO title", function() {
            helpers.navigateToSite();
            helpers.getTitleText().then(function(text) {
                assert.equal(text, "TODO List");
            });
        });
        testing.it("displays empty TODO list", function() {
            helpers.navigateToSite();
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("get", "/api/todo");
            helpers.navigateToSite();
            helpers.getErrorText().then(function(text) {
                assert.equal(text.substring(0, 14), "Request failed");
            });
        });
    });
    testing.describe("on create todo item", function() {
        testing.it("clears the input field", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getInputText().then(function(value) {
                assert.equal(value, "");
            });
        });
        testing.it("adds the todo item to the list", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
        });
        testing.it("displays an error if the request fails", function() {
            helpers.setupErrorRoute("post", "/api/todo");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getErrorText().then(function(text) {
                assert.equal(text.substring(0, 14), "Request failed");
            });
        });
        testing.it("can be done multiple times", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.addTodo("Another new todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
        });
    });
    testing.describe("check delete functionality", function() {
        testing.it("deletes the todo item from the list", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.deleteItem("0");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("deletes the correct item", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.addTodo("Another todo item");// id 1
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.deleteItem("1");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.checkElementExists("delete0").then(function(element) {
                assert.isTrue(element);
            });
            helpers.deleteItem("0");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("cannot delete items that dont exist", function() {
            helpers.setupErrorRoute("delete", "/api/todo/0");
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.deleteItem("0");
            helpers.getErrorText().then(function(text) {
                assert.equal(text.substring(0, 14), "Request failed");
            });
        });
    });
    testing.describe("check complete functionality", function() {
        testing.it("completes the item and changes color", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
                helpers.getElementColor(elements[0]).then(function (oldColor) {
                    helpers.completeItem("0");
                    helpers.getTodoList().then(function(elems) {
                        assert.equal(elems.length, 1);
                    });
                    helpers.getTodoList().then(function(els) {
                        helpers.getElementColor(els[0]).then(function (newColor) {
                            assert.notEqual(oldColor, newColor);
                        });
                    });
                });
            });
        });
    });
    testing.describe("check complete count functionality", function() {
        testing.it("complete count correct with 1 item", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 1);
            });
        });
        testing.it("complete count correct with 2 items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.addTodo("Another todo item");// id 0
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 2);
            });
        });
        testing.it("complete count correct with 3 items, 1 completed", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.addTodo("Another todo item");// id 0
            helpers.addTodo("Another todo item");// id 0
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 3);
            });
            helpers.completeItem("1");
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 2);
            });
        });
        testing.it("complete count correct with 3 items, 1 completed, then deleted", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item");// id 0
            helpers.addTodo("Another todo item");// id 1
            helpers.addTodo("Another todo item");// id 2
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 3);
            });
            helpers.completeItem("1");
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 2);
            });
            helpers.deleteItem("0");
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 1);
            });
            helpers.deleteItem("2");
            helpers.getElementText("count-label").then(function(text) {
                var count = Number(text.split(" ")[2]);
                assert.equal(count, 0);
            });
        });
    });
    testing.describe("check delete completed functionality", function() {
        testing.it("does not delete incomplete items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item 1");// id 0
            helpers.addTodo("New todo item 2");// id 1
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.completeItem("1");
            helpers.pause(500).then(function () {
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 2);
                });
                helpers.clickDeleteComplete();
                helpers.getTodoList().then(function(elements) {
                    assert.equal(elements.length, 1);
                });
                helpers.pause(500).then(function () {
                    helpers.checkElementExists("delete0").then(function (val) {
                        assert.isTrue(val);
                    });
                });
            });
        });
        testing.it("deletes multiple items", function() {
            helpers.navigateToSite();
            helpers.addTodo("New todo item 1");// id 0
            helpers.addTodo("New todo item 2");// id 1
            helpers.addTodo("New todo item 3");// id 2
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 3);
            });
            helpers.pause(500).then(function () {
                helpers.completeItem("0");
                helpers.pause(500).then(function () {
                    helpers.completeItem("1");
                    helpers.getTodoList().then(function(elements) {
                        assert.equal(elements.length, 3);
                    });
                    helpers.pause(500).then(function () {
                        helpers.clickDeleteComplete();
                        helpers.getTodoList().then(function(elements) {
                            assert.equal(elements.length, 1);
                        });
                        helpers.checkElementExists("complete2").then(function (val) {
                            assert.isTrue(val);
                        });
                    });
                });
            });
        });
    });
    testing.describe("check filter button functionality", function() {
        testing.it("does not show buttons if no items in list", function() {
            helpers.navigateToSite();
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, false);
            });
        });
        testing.it("shows buttons if items are in list", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item");
            helpers.pause(500).then(function() {
                helpers.checkElementExists("all").then(function(val) {
                    assert.equal(val, true);
                });
                helpers.checkElementExists("complete").then(function(val) {
                    assert.equal(val, true);
                });
                helpers.checkElementExists("incomplete").then(function(val) {
                    assert.equal(val, true);
                });
            });
        });
        testing.it("default filter is all", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
        });
        testing.it("correctly filters incomplete items", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.clickButton("incomplete");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
        });
        testing.it("correctly filters complete items", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 2);
            });
            helpers.clickButton("complete");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 0);
            });
        });
        testing.it("correctly filters multiple complete items", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 0");
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.clickButton("complete2");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 3);
            });
            helpers.clickButton("complete");
            helpers.getTodoList().then(function(elements) {
                assert.equal(elements.length, 1);
            });
        });
        testing.it("correctly filters multiple incomplete items", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 0");
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.addTodo("Item 3");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.pause(500).then(function() {
                helpers.clickButton("complete2");
                helpers.pause(500).then(function() {
                    helpers.clickButton("complete1");
                    helpers.getTodoList().then(function(elements) {
                        assert.equal(elements.length, 4);
                    });
                    helpers.clickButton("incomplete");
                    helpers.getTodoList().then(function(elements) {
                        assert.equal(elements.length, 2);
                    });
                });
            });
        });
        testing.it("correctly filters multiple incomplete items on button press", function() {
            helpers.navigateToSite();
            helpers.addTodo("Item 0");
            helpers.addTodo("Item 1");
            helpers.addTodo("Item 2");
            helpers.addTodo("Item 3");
            helpers.checkElementExists("all").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("complete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.checkElementExists("incomplete").then(function(val) {
                assert.equal(val, true);
            });
            helpers.pause(500).then(function() {
                helpers.clickButton("incomplete");
                helpers.pause(1000).then(function() {
                    helpers.clickButton("complete1");
                    helpers.pause(1000).then(function() {
                        helpers.getTodoList().then(function(elements) {
                            assert.equal(elements.length, 3);
                        });
                        helpers.clickButton("all");
                        helpers.getTodoList().then(function(elements) {
                            assert.equal(elements.length, 4);
                        });
                    });
                });
            });
        });
    });
});
