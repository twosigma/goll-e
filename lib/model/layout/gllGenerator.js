'use strict';

var generateGll = function(loadedLayout) {
  var layoutStrings = [''];
  loadedLayout.keys().forEach(function(key) {
    var result = key + ' ';
    var layout = loadedLayout.fetch(key);
    var position = layout.get('position');
    var isPinned = layout.get('isPinned');
    if (position && isPinned) {
      if ('x' in position) {
        result += position.x + ' ' + position.y;
      } else {
        result += position.get('direction') + ' ' + position.get('percentage') + '%';
      }
      layoutStrings.push(result);
    }
  });
  var gll = layoutStrings.join('\n');
  return gll;
};

module.exports = generateGll;
