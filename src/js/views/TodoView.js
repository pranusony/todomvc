function TodoView(rootNode, todoModel) {

    var todoInput;
    var todoList;
    var toggleAll;
    var footer ;
    var todoCount;
    var clearCompleted;
    var filtersList;
    var listItems = [];




    todoModel.subscribe(ModelEvents.TODO_ADDED, handleTodoAdded, this);
    todoModel.subscribe(ModelEvents.TODO_REMOVED, handleTodoRemoved, this);
    todoModel.subscribe(ModelEvents.MARK_ALL_COMPLETED, handleMarkAllCompleted, this);
    todoModel.subscribe(ModelEvents.REMOVE_ALL_COMPLETED, handleRemoveCompleted, this);
    todoModel.subscribe(ModelEvents.MARK_TODO_COMPLETED, handleMarkToDoCompleted, this);
    todoModel.subscribe(ModelEvents.TODO_EDITED, handleToDoEdited, this);
    todoModel.subscribe(ModelEvents.ACTIVE_TODOITEMS_CHANGED, handleActiveToDoCountChanged, this);
    todoModel.subscribe(ModelEvents.COMPLETED_ITEMS_CHANGED, handleCompletedToDoCountChanged, this);
    todoModel.subscribe(ModelEvents.TODO_ITEMS_CHANGED,handleShowHide,this);

    function handleShowHide(){
        if(todoModel.todoItems.length == 0){
            footer.style.display = "none";
            toggleAll.style.display = "none";
        }
        else{
            footer.style.display = "block";
            toggleAll.style.display = "block";
        }
    }

    function handleCompletedToDoCountChanged(){
        if(todoModel.completedTodoItemsCount >0){
            clearCompleted.style.display = "block";
        }
        else
            clearCompleted.style.display = "none";
    }



    function handleActiveToDoCountChanged(){
        var span = document.getElementsByClassName("todo-count")[0];
        var strong;

        if (span.childNodes.length == 0) {
            strong = document.createElement("STRONG");
            span.appendChild(strong);
        }
        else {
            strong = span.childNodes[0];
        }

        strong.innerHTML = todoModel.activeTodoItemsCount + " items left";
    }


    function handleTodoAdded(data) {
        var li = document.createElement("li");
        var toDoListItemView = new TodoListItemView(li, data, todoModel);
        toDoListItemView.render();
        todoList.appendChild(li);
        listItems.push(toDoListItemView);

    }

    function handleTodoRemoved(data) {
        for (var i = 0; i < listItems.length; i++) {
            var toDoListItemView = listItems[i];
            if (toDoListItemView.todoItem == data) {
                todoList.removeChild(toDoListItemView.li);
                listItems.splice(i, 1);
                break;
            }
        }
    }


    function handleTextEntered(e) {
        var key = e.keyCode || e.which;
        if (key == 13) {
            todoModel.addTodo(e.target.value);
        }
    }

    function handleMarkAllCompleted() {
        for (var j = 0; j < todoModel.todoItems.length; j++) {
            var todoItem = todoModel.todoItems[j];
            for (var i = 0; i < listItems.length; i++) {
                var toDoListItemView = listItems[i];
                if (toDoListItemView.todoItem === todoItem) {
                    var checkbox = toDoListItemView.li.childNodes[0].childNodes[0];
                    checkbox.checked = todoItem.completed;
                    toDoListItemView.li.className = todoItem.completed ? "completed" : "";
                    break;
                }
            }
        }
    }

    function handleRemoveCompleted(removedItems) {
        for (var j = removedItems.length - 1; j >= 0; j--) {
            var todoItem = removedItems[j];
            for (var i = listItems.length - 1; i >= 0; i--) {
                var toDoListItemView = listItems[i];
                if (toDoListItemView.todoItem === todoItem) {
                    todoList.removeChild(toDoListItemView.li);
                    listItems.splice(i,1);
                    break;
                }

            }

        }
    }

    function handleMarkToDoCompleted(data){
        for(var i=0; i<listItems.length ;i++){
            var toDoListItemView = listItems[i];
            if(toDoListItemView.todoItem == data){
                var checkbox = toDoListItemView.li.childNodes[0].childNodes[0];
                checkbox.checked = data.completed;
                toDoListItemView.li.className = data.completed ? "completed" :"";
                break;
            }
        }

    }

    function handleToDoEdited(data){
        for(var i=0; i<listItems.length;i++){
            var toDoListItemView = listItems[i];
            if(toDoListItemView.todoItem == data){
                var li = toDoListItemView.li;
                var input = toDoListItemView.li.childNodes[0].childNodes[0];
                var label = toDoListItemView.li.childNodes[0].childNodes[1];
                label.textContent = data.description;
                toDoListItemView.li.className = data.completed ? "completed": "";
            }

        }


    }







    function handleToggleAllClicked() {
        todoModel.markAllCompleted(toggleAll.checked);
    }

    function handleClearCompletedClicked() {
        todoModel.removeAllCompleted();
    }

    function handleFilterClicked(e) {
        var filterType = e.target.id;
        var link = footer.getElementsByTagName("a");
        for (var count = 0; count < link.length; count++) {
            link[count].className = "";
        }
        for(var i=0; i<listItems.length; i++){
            var todoListItemView = listItems[i];
            var li = todoListItemView.li ;
            var hide = false;
            if (filterType == "active") {
                link[1].className = "selected";
                if (todoListItemView.li.className != "completed") {
                    hide = true;
                }
            } else if (filterType == "completed") {
                link[2].className = "selected";
                if (todoListItemView.li.className == "completed") {
                    hide = true;
                }
            }
            else {
                link[0].className = "selected";
            }
            if (hide == true) {
                todoListItemView.li.style.display = "none";
            }
            else {
                todoListItemView.li.style.display = "list-item";
            }
        }
    }




    this.render = function () {

        var myView = '<header class ="header">' +
            '            <h1>todos</h1>' +
            '            <input class="new-todo" placeholder="what needs to be done?" autofocus >' +
            '        </header>' +
            '' +
            '        <section class="main">' +
            '            <input type="checkbox" class="toggle-all" >' +
            '            <label for="toggle-all">Mark all as complete</label>' +
            '            <ul class = "todo-list"></ul>' +
            '        </section>' +
            '        <footer class="footer">' +
            '            <span class="todo-count"></span>' +
            '            <ul class="filters">' +
            '                <li>' +
            '                    <a href="#/" class = "selected" id="all">All</a>' +
            '                </li>' +
            '                <li>' +
            '                    <a href="#/"class = "Active" id="active">Active</a>' +
            '                </li>' +
            '                <li>' +
            '                    <a href="#/" class = "completed" id="completed">Completed</a>' +
            '                </li>' +
            '            </ul>' +
            '            <button class="clear-completed">Clear completed</button>' +
            '        </footer>';

        rootNode.innerHTML = myView;

        toggleAll = rootNode.getElementsByClassName("toggle-all")[0];
        todoInput = rootNode.getElementsByClassName("new-todo")[0];
        todoList = rootNode.getElementsByClassName("todo-list")[0];
        todoCount = rootNode.getElementsByClassName("todo-count")[0];
        clearCompleted = rootNode.getElementsByClassName("clear-completed")[0];
        filtersList = rootNode.getElementsByClassName("filters")[0];
        footer = rootNode.getElementsByClassName("footer")[0];

        handleShowHide();

        todoInput.addEventListener("keyup", handleTextEntered);
        toggleAll.addEventListener("click", handleToggleAllClicked);
        clearCompleted.addEventListener("click", handleClearCompletedClicked);
        filtersList.addEventListener("click", handleFilterClicked);


    };
}


