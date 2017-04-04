function TodoModel() {

    var subject = new Subject();

    this.todoItems = [];
    var activeTodoItemsCount = 0;
    Object.defineProperty(this, 'activeTodoItemsCount', {
        get: function() { return activeTodoItemsCount; },
        set:function (value) {
            activeTodoItemsCount = value;
            subject.publish(ModelEvents. ACTIVE_TODOITEMS_CHANGED);
        }
    });



       this.completedTodoItemsCount = 0;

    //add methods below

    this.addTodo = function (description) {
        var toDoItem = new TodoItem();
        toDoItem.description = description;
        this.todoItems.push(toDoItem);
        this.activeTodoItemsCount++;
        subject.publish(ModelEvents.TODO_ADDED, toDoItem);
        subject.publish(ModelEvents.TODO_ITEMS_CHANGED, this.todoItems);
    };

    this.removeTodo = function (todoItem) {
        var index = this.todoItems.indexOf(todoItem);
        if (index > -1)
            this.todoItems.splice(index, 1);
            subject.publish(ModelEvents.TODO_ITEMS_CHANGED, this.todoItems);
        if(todoItem.completed ){
            this.completedTodoItemsCount--;
            subject.publish(ModelEvents. COMPLETED_ITEMS_CHANGED);

        }


        else
            this.activeTodoItemsCount--;
        subject.publish(ModelEvents.TODO_REMOVED, todoItem);
    };

    this.markAllCompleted = function (toggleAll) {
        for (var i = 0; i < this.todoItems.length; i++) {
            this.todoItems[i].completed = toggleAll;
        }
        if(toggleAll){
            this.completedTodoItemsCount = this.todoItems.length;
            subject.publish(ModelEvents.COMPLETED_ITEMS_CHANGED);
            this.activeTodoItemsCount = 0;
        }
        else{
            this.completedTodoItemsCount = 0;
            subject.publish(ModelEvents.COMPLETED_ITEMS_CHANGED);
            this.activeTodoItemsCount = this.todoItems.length;
        }
        subject.publish(ModelEvents.MARK_ALL_COMPLETED, this.todoItems);
    };

    this.removeAllCompleted = function () {
        var removedItems = [];
        for (var i = this.todoItems.length - 1; i >= 0; i--) {
            if (this.todoItems[i].completed) {
                var todoItem = this.todoItems[i];
                this.todoItems.splice(i, 1);
                removedItems.push(todoItem);
            }
        }
        this.completedTodoItemsCount =0;
        subject.publish(ModelEvents.COMPLETED_ITEMS_CHANGED);
        subject.publish(ModelEvents.REMOVE_ALL_COMPLETED,removedItems);
        subject.publish(ModelEvents.TODO_ITEMS_CHANGED, this.todoItems);
    };

    this.markTodoCompleted = function (toggle, todoItem) {
        todoItem.completed = toggle;
        if(toggle){
            this.completedTodoItemsCount++;
            subject.publish(ModelEvents.COMPLETED_ITEMS_CHANGED);
            this.activeTodoItemsCount--;
        }
        else{
            this.completedTodoItemsCount--;
            subject.publish(ModelEvents.COMPLETED_ITEMS_CHANGED);
            this.activeTodoItemsCount++;
        }
        subject.publish(ModelEvents.MARK_TODO_COMPLETED, todoItem);

    };

    this.editTodo = function (todoItem, newDescription) {

        todoItem.description = newDescription;
        if(!todoItem.description){
            this.removeTodo(todoItem);
        }
    };

    this.subscribe = function (eventName, handler, thisContext) {

        subject.subscribe(eventName, handler, thisContext);
    }

}