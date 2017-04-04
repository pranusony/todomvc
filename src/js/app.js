
var todoModel = new TodoModel();

var todoView = new TodoView(document.getElementsByClassName("todoapp")[0],todoModel);

//calling render to create and add the dom to the parent
todoView.render();