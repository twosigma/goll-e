/**
 * Callback which is called upon at some point during a drag event in React.
 *
 * @callback drawCallback
 * @param {event} event The original mouse event.
 */

/**
 * This utility implements dragging for SVG elements in React. That is, it
 * wraps mouse events and simulates drag events, but does not support complex
 * drag-and-drop functionality.
 *
 * Users of this utility should define the three callbacks and then set the
 * onMouseDown of the draggable element to mouseDownDrag.bind(this,
 * someUniqueName, myPseudoDragStartCallback, myPseudoDragEndCallback,
 * myPseudoDragCallback). someUniqueName can be anything, as long it's unique
 * within the component.
 *
 * The using component can check its state for the key
 * (someUniqueName + '_dragging') to see if a particular draggee is dragging.
 *
 * @param {*} name - Name which is used to uniquely identify *this* drag event.
 * @param {dragCallback} pseudoDragStartCallback - Callback which is fired
 * upon the start of a drag event.
 * @param {dragCallback} pseudoDragEndCallback - Callback which is fired upon
 * the end of a drag event.
 * @param {dragCallback} pseudoDragCallback - Callback which is fired when the
 * mouse moves. Use this to update the position of whatever is being drawn.
 * @param {event} event - The original mouse event?
 * @returns {void}
 */
var mouseDownDrag = function(name, pseudoDragStartCallback, pseudoDragEndCallback, pseudoDragCallback, event) {

  // Turn on the dragging flag and store the initial drag position in state.
  var newState = {};
  newState[name + '_dragging'] = true;
  this.setState(newState);

  // Register event handlers to terminate dragging when the mouse leaves
  // the window or when the button is released.
  // Note that we're turning off the ESLint 'no shadow' rule check here.
  /*eslint-disable no-shadow*/
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
    if (this.state[name + '_dragging'] && pseudoDragCallback) {
      pseudoDragCallback(event);
    }
  }.bind(this, name, pseudoDragCallback);
  // Turn the 'no shadow' rule back on.
  /*eslint-enable no-shadow*/

  // Call the pseudo drag start callback.
  if (pseudoDragStartCallback) {
    pseudoDragStartCallback(event);
  }
};

module.exports = mouseDownDrag;
