var Lang = require('./../utilities/lang');
var createClass = require('./../utilities/createClass');
var Styles = require('./styles');

var VertexStyles = createClass({
  extend: Styles,
  
  attrs: {
    width: {
      value: 150,
      validator: Lang.isNumber
    },

    height: {
      value: 94,
      validator: Lang.isNumber
    },

    /**
     * Defines the general look and shape of the vertex,
     * and a set of other styles to customize the shape. 
     * Supported shapes:
     *   - default: a rectangle with limited customization besides a color bar on top defined by `color`. 
     *     Vertices with subgraphs have hard corners, others have rounddd corners.
     * Possible future shapes:
     *   - rectangle: a basic rectangle allowing for custom fills and outlines.
     *   - circle: a circle
     *   - polygon: an arbitrary polygon.
     * @attribute shape
     * @type      [type]
     */
    shape: {
      value: 'default'
    },

    color: {
      value: '#4f4f4f',
      validator: Lang.isString
    }

  }
});

module.exports = VertexStyles;