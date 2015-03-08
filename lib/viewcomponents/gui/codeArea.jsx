var React = require('react');
var Lang = require('../../utilities/lang');
var ObjectUtils = require('../../utilities/objects');


var KEY_CODE = {
  TAB: 9,
  BACKSPACE: 8,
  RETURN: 13
};

var handleKeydown = function(e) {
  var el = e.target;
  var text = el.value;
  var start = el.selectionStart;
  var end = el.selectionEnd;
  var tabStr = this.tabStr;

  switch (e.keyCode) {
    case KEY_CODE.TAB:
    // insert a tab instead of losing focus
    e.preventDefault();
    el.value = text.substring(0, start) + tabStr + text.substring(end);
    el.selectionStart = el.selectionEnd = start + tabStr.length;
    break;

    case KEY_CODE.BACKSPACE:
    // delete all tab characters together
    if (start >= tabStr.length && start === end && text.substring(start - tabStr.length, start) === tabStr) {
      e.preventDefault();
      el.value = text.substring(0, start - tabStr.length) + text.substring(end);
      el.selectionStart = el.selectionEnd = start - tabStr.length;
    }
    break;

    case KEY_CODE.RETURN:
    //auto tab to last indent level
    e.preventDefault();

    //extract the current line of text
    var thisLine = text.substring(0, start);
    var lastNewline = thisLine.lastIndexOf('\n');
    if (lastNewline !== -1) {
      thisLine = thisLine.substring(1 + lastNewline);
    }

    var insertString = '\n';
    // count tabs
    while (thisLine.length >= tabStr && thisLine.substr(0, tabStr.length) === tabStr) {
      insertString += tabStr;
      thisLine = thisLine.substring(tabStr.length);
    }

    el.value = text.substring(0, start) + insertString + text.substring(end);
    el.selectionStart = el.selectionEnd = start + insertString.length;
    break;
  }
};

/**
 * Identical to an HTML textarea, but has reasonable defaults for code,
 * especially with smart tabbing (tabbing in a textarea blurs it).
 * @class CodeArea
 * @constructor
 */
var CodeArea = React.createClass({
  propTypes: {
    // single character, usually a tab or space
    tabChar: React.PropTypes.string,
    // how many of the tabChar, or if it was a \t, the displayed width
    tabSize: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      tabChar: ' ',
      tabSize: 2,
      spellCheck: false
    };
  },

  render: function() {
    // Copy any props passed to this class directly down to the textarea
    // So that this will act just like a textarea
    var textAreaProps = ObjectUtils.merge(this.props);

    // Set props on the text area, but ensure not to break any external expectations
    // that this still work like a textarea
    textAreaProps.onKeyDown = function() {
      handleKeydown.apply(this, arguments);

      if (Lang.isFunction(this.props.onKeyDown)) {
        this.props.onKeyDown.apply(this, arguments);
      }
    }.bind(this);

    textAreaProps.className = 'code-area';

    if (Lang.isString(this.props.className)) {
      textAreaProps.className += ' ' + this.props.className;
    }

    if (this.props.tabChar === '\t') {
      // set the display size of the tab character
      if (!Lang.isObject(textAreaProps.style)) {
        textAreaProps.style = {};
      }
      // does not actually work due to a React bug, but nice try.
      textAreaProps.style['tab-size'] = this.props.tabSize;

      this.tabStr = '\t';

    } else {
      this.tabStr = (new Array(this.props.tabSize + 1)).join(this.props.tabChar);
    }


    return React.createElement('textarea', textAreaProps, this.props.children);
  }
});

module.exports = CodeArea;
