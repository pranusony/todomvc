

function Subject() {

    var eventHandlersMap = {};

    this.subscribe = function (eventName, handlerFunction,thisContext) {

        if(!eventHandlersMap[eventName])
            eventHandlersMap[eventName] = [];

        eventHandlersMap[eventName].push(handlerFunction.bind(thisContext));
    };

    this.publish = function (eventName, data) {

        var handlerFunctions = eventHandlersMap[eventName];

        if(handlerFunctions) {

            handlerFunctions.forEach(function (handlerFunction) {

                handlerFunction(data);

            })
        }
    };
}