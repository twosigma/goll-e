var globalToLocalCoordinates = function(e) {
    // thanks to http://stackoverflow.com/questions/4850821/svg-coordinates-with-transform-matrix
    // var localEl = this.refs.edge.getDOMNode();
    var localEl = e.target;
    var svg = localEl.ownerSVGElement;
    var pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    var globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    var globalToLocal = localEl.getTransformToElement(svg).inverse();
    var inObjectSpace = globalPoint.matrixTransform(globalToLocal);
    return inObjectSpace;
};

module.exports = globalToLocalCoordinates;