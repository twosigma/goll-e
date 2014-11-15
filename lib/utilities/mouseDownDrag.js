// Users of this utility should define the three callbacks and then set the onMouseDown of the draggable component to
// this._dragMousedown.bind(this, someUniqueName, callback1, callback2, callback3).
var mouseDownDrag = function(name, pseudoDragStartCallback, pseudoDragEndCallback, pseudoDragCallback, event) {
    // Turn on the dragging flag and store the initial drag position in state.
    var newState = {};
    newState[name + '_dragging'] = true;
    this.setState(newState);

    // Register event handlers to terminate dragging when the mouse leaves the window or when the button is released.
    window.onmouseup = window.onmouseleave = function(name, event) {
        // Turn off the dragging flag.
        var newState = {};
        newState[name + '_dragging'] = false;
        this.setState(newState);
        // Remove mouse listeners from the window.
        window.onmousemove = null;
        window.onmouseleave = null;
        // Call the pseudo drag end callback.
        if (pseudoDragEndCallback) {
            pseudoDragEndCallback(event);
        }
    }.bind(this, name);

    // Register the pseudo drag callback.
    window.onmousemove = function(name, pseudoDragCallback, event) {
        if (/*!!this.state && */this.state[name + '_dragging'] && pseudoDragCallback) {
            pseudoDragCallback(event);
        }
    }.bind(this, name, pseudoDragCallback);

    // Call the pseudo drag start callback.
    if (pseudoDragStartCallback) {
            pseudoDragStartCallback(event);
    }
}; 

module.exports = mouseDownDrag;