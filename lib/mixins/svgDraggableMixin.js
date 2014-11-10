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
        // Turn on the dragging flag.
        this.setState({
            dragging: true
        });
    },

    _dragOnMouseMove: function(event) {
        // If we're currently dragging,
        if (!!this.state && this.state.dragging) {
            // then pass off the delta of the drag to the component's onDrag
            var simpleDragEvent = {
                deltaX: event.movementX,
                deltaY: event.movementY
            };
            this._onDrag(simpleDragEvent);
        }
    },

    _dragOnMouseUp: function(event) {
        // Turn off the dragging flag.
        this.setState({
            dragging: false
        });
    }
};

module.exports = SVGDraggableMixin;
