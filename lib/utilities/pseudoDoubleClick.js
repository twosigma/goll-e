var CLICK_TIME_MS = 500;

/**
 * Bind on onClick and get called back on double click.
 * For when native onDblClick does not work (as in React)
 *
 * Intended to be bound to onClick using a .bind to specify setup parameters and context e.g.
 * `el.onclick = doubleClick.bind(this, 'my_id', handlerFn);`
 *
 * @method doubleClick
 * @param  {Strnig} name
 * @param  {Function} cb
 * @param  {MouseEvent} e
 */
var doubleClick = function(name, cb, e) {
  var stateKey = name + '_double_click_start';
  var startTime = this.state[stateKey];
  var newState = {};

  if (startTime && Date.now() - startTime <= CLICK_TIME_MS) {
    cb(e);
    newState[stateKey] = false;
  } else {
    newState[stateKey] = Date.now();
  }

  this.setState(newState);
};

module.exports = doubleClick;
