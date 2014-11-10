var SVGDraggableMixin = {
    
    componentDidMount: function() {
        this._registerMouseEvents();
    },

    // componentDidUpdate: function() {
    //     this._registerMouseEvents();
    // },

    _registerMouseEvents: function() {
        // Ask the inheriting component to provide the drggable element via a ref.
        var draggableElement = this._getDraggableRef().getDOMNode();
        // Set the mouse events on the element.
        draggableElement.onmousedown = this._dragOnMouseDown;
        draggableElement.onmousemove = this._dragOnMouseMove;
        draggableElement.onmouseup = this._dragOnMouseUp;
    },

    _dragOnMouseDown: function(event) {
        var newDragX = event.clientX;
        var newDragY = event.clientY;
        this.setState({
            dragX: newDragX,
            dragY: newDragY,
            dragging: true
        });
    },

    _dragOnMouseMove: function(event) {
        console.log(event.movementX);
        if (!!this.state && this.state.dragging) {
            var oldDragX = this.state.dragX;
            var oldDragY = this.state.dragY;
            var newDragX = event.clientX;
            var newDragY = event.clientY;
            var deltaX = newDragX - oldDragX;
            var deltaY = newDragY - oldDragY;
            this.setState({
                dragX: newDragX,
                dragY: newDragY
            });

            // Pass off the delta of the drag to the component's onDrag
            var simpleDragEvent = {
                clientX: event.clientX,
                clientY: event.clientY,
                deltaX: deltaX,
                deltaY: deltaY
            };
            this._onDrag(simpleDragEvent);
        }
    },

    _dragOnMouseUp: function(event) {
        this.setState({
            dragX: null,
            dragY: null,
            dragging: false
        });
    }
};

module.exports = SVGDraggableMixin;
