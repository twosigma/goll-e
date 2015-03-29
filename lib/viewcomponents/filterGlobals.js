module.exports = '<filter id="standard-shadow" x="0" y="0" width="200%" height="200%">' +
  '<feGaussianBlur in="SourceAlpha" stdDeviation="5"/>' +
  '<feOffset dx="2" dy="3.46"  result="offsetblur"/>' +
  '<feFlood flood-color="rgba(0,0,0,0.22)"/>' +
  '<feComposite in2="offsetblur" operator="in"/>' +
  '<feMerge>' +
  '<feMergeNode/>' +
  '<feMergeNode in="SourceGraphic"/>' +
  '</feMerge>' +
'</filter>';