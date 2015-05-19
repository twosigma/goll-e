var PortLayout = require('./portLayout');
var VertexLayout = require('./vertexLayout');

var generateGll = function(loadedLayout) {
  var layoutStrings = [];
  loadedLayout.keys().forEach(function(key) {
    var result = key + ' ';
    var layout = loadedLayout.fetch(key);
    var position = layout.get('position');
    var isPinned = layout.get('isPinned');
    if (position && isPinned) {
      if (layout instanceof VertexLayout) {
        result += Math.round(position.x) + ' ' + Math.round(position.y);
      } else if (layout instanceof PortLayout) {
        result += position.get('direction') + ' ' + Math.round(position.get('percentage')) + '%';
      }
      layoutStrings.push(result);
    }
  });
  var gll = layoutStrings.join('\n');
  return gll;
};

module.exports = generateGll;
