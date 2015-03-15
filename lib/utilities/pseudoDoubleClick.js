var CLICK_TIME_MS = 500;

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