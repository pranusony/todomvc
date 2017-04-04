function TodoListItemView(rootNode, todoItem, todoModel) {

    var strikeTodoListItem;
    var removeTodoListItem;
    var editInput;
    this.li = rootNode;
    this.todoItem = todoItem;

    this.render = function () {
        var myTodoListItemView = '<div class="view">' +
            '<input type="checkbox" class="toggle">' +
            '<label>' + todoItem.description + '</label>' +
            '<button class="destroy"> </button>' +
            '</div>' +
            '<input class = "edit">';
        rootNode.innerHTML = myTodoListItemView;

        strikeTodoListItem = rootNode.getElementsByClassName("toggle")[0];
        removeTodoListItem = rootNode.getElementsByClassName("destroy")[0];
        editInput = rootNode.getElementsByClassName("edit")[0];
        strikeTodoListItem.addEventListener("click", handleStrikeThroughListItem);
        removeTodoListItem.addEventListener("click", handleRemoveListItem);
        rootNode.addEventListener("dblclick", edit);
        editInput.addEventListener("keyup", editText);
        document.addEventListener("click", function (e) {
            if (e.target != editInput && rootNode.className.indexOf("editing") != -1) {
                handleEditingDone(editInput);
            }
        });

    };


    function handleStrikeThroughListItem() {
        todoModel.markTodoCompleted(strikeTodoListItem.checked, todoItem);

    }


    function handleRemoveListItem() {
        todoModel.removeTodo(todoItem);
    }

    function handleEditListItem() {

    }

    function edit() {
        var listItem = this;
        var input = listItem.childNodes[0].childNodes[0];
        var label = listItem.childNodes[0].childNodes[1];
        if (todoItem.completed) {
            listItem.className = "completed  editing";
        }
        else
            listItem.className = "editing";

        editInput.value = label.textContent;


    }

    function editText(e) {
        var editInput = e.currentTarget || this;
        var key = e.keyCode || e.which;
        if (key == 13) {
            handleEditingDone(editInput);

        }


    }

    function handleEditingDone(editInput) {
        todoModel.editTodo(todoItem, editInput.value)

    }


}