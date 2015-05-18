var layoutEngine = require('./layout/forceDirectedLayout');
var parse = require('./parse/parse');

var log = function(message) {
  console.log(message);

  var li = document.createElement('li');
  li.innerHTML = message;
  document.getElementById('output').appendChild(li);
};

var StopWatchLogger = function() {};
StopWatchLogger.prototype = {
  start: function(name) {
    log('' + name + ' started');
    this.name = name;
    this.startTime = Date.now();
  },

  stop: function() {
    log('' + this.name + ' completed [' + (Date.now() - this.startTime) + 'ms]');
  }
};

function processGcl(gcl) {
  var stopwatch = new StopWatchLogger();

  stopwatch.start('Parsing');
  var parseResult = parse(gcl);
  stopwatch.stop();

  var errors = parseResult.gclErrors;
  console.log(errors);

  var model = parseResult.model;

  stopwatch.start('Layout engine');
  layoutEngine(model);
  stopwatch.stop();
  console.debug(model);
}

/*eslint-disable*/
gclSubmit = function() {
  document.getElementById('output').innerHTML = '';

  try {
    var gcl = document.forms.gcl['gcl-code'].value;
    processGcl(gcl);
  } catch (e) {
    log('Failed');
    console.error(e);
    return false;
  }

  return false;
};
/*eslint-enable*/
