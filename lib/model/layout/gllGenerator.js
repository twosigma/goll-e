var PortLayout = require('./portLayout');
var VertexLayout = require('./vertexLayout');
var EdgeLayout = require('./edgeLayout');

var generateGll = function(loadedLayout) {
  var layoutStrings = [];
  loadedLayout.keys().forEach(function(key) {
    var result = key + ' ';
    var layout = loadedLayout.fetch(key);
    var isPinned = layout.get('isPinned');
    if (isPinned) {
      if (layout instanceof VertexLayout) {
        var vertexPosition = layout.get('position');
        result += Math.round(vertexPosition.x) + ' ' + Math.round(vertexPosition.y);
      } else if (layout instanceof PortLayout) {
        var portPosition = layout.get('position');
        result += portPosition.get('direction') + ' ' + Math.round(portPosition.get('percentage')) + '%';
      } else if (layout instanceof EdgeLayout) {
        var points = layout.get('reroutePoints').toArray();
        result += '{\n';
        for (var i = 0; i < points.length; ++i) {
          var point = points[i];
          result += '  ' + point.get('x') + ' ' + point.get('y') + '\n';
        }
        result += '}';
      }
      layoutStrings.push(result);
    }
  });
  var gll = layoutStrings.join('\n');
  return gll;
};

module.exports = generateGll;
