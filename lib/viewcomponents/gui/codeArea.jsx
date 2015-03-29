var React = require('react');
var Lang = require('../../utilities/lang');
var ObjectUtils = require('../../utilities/objects');


var KEY_CODE = {
  TAB: 9,
  BACKSPACE: 8,
  RETURN: 13,
  LBRACKET: 219,
  RBRACKET: 221
};

/**
 * Simulate pasting a string where the focus is.
 * Ensure focus and caret are positioned before calling!
 *
 * Unlike setting the value of a textarea, this supports undo/redo.
 * @method typeString
 * @param  {Sttring} insertString
 */
var typeString = function(insertString) {
  document.execCommand('insertText', false, insertString);
};

var handleTab = function(e) {
  var tabStr = this.tabStr;

  // insert a tab instead of losing focus
  e.preventDefault();
  typeString(tabStr);
};

var handleBackspace = function(e) {
  var el = e.target;
  var text = el.value;
  var start = el.selectionStart;
  var end = el.selectionEnd;
  var tabStr = this.tabStr;

  // delete all tab characters together
  if (start >= tabStr.length && start === end && text.substring(start - tabStr.length, start) === tabStr) {
    e.preventDefault();
    el.value = text.substring(0, start - tabStr.length) + text.substring(end);
    el.selectionStart = el.selectionEnd = start - tabStr.length;
  }
};

var getCurrentIndentString = function(e) {
  var el = e.target;
  var text = el.value;
  var start = el.selectionStart;
  var tabStr = this.tabStr;

  //extract the current line of text
  var thisLine = text.substring(0, start);
  var lastNewline = thisLine.lastIndexOf('\n');
  if (lastNewline !== -1) {
    thisLine = thisLine.substring(1 + lastNewline);
  }

  var indentString = '';
  // count tabs
  while (thisLine.length >= tabStr && thisLine.substr(0, tabStr.length) === tabStr) {
    indentString += tabStr;
    thisLine = thisLine.substring(tabStr.length);
  }

  return indentString;
};

var handleReturn = function(e) {
  var el = e.target;
  var text = el.value;
  var start = el.selectionStart;
  var tabStr = this.tabStr;

  //auto tab to last indent level
  e.preventDefault();

  var currentIndentString = getCurrentIndentString.apply(this, arguments);

  var insertString = '\n' + currentIndentString;
  var caretAdvance = insertString.length;

  // if last character was a block opener, open a new level
  if (start > 0 && text.substring(start - 1, start).match(/[\{\()]/)) {
    insertString += tabStr;
    caretAdvance += tabStr.length;

    //additionally, if the next character is a block closer, add an additional newline
    if (start < text.length && text.substring(start, start + 1).match(/[\}\)]/)) {
      insertString += '\n' + currentIndentString;
    }
  }

  typeString(insertString);
  el.selectionStart = el.selectionEnd = start + caretAdvance;
};

var handleLBrace = function(e) {
  var el = e.target;
  var start = el.selectionStart;

  e.preventDefault();

  typeString('{}');
  el.selectionStart = el.selectionEnd = start + 1;
};


var handleKeydown = function(e) {
  switch (e.keyCode) {
    case KEY_CODE.TAB:
    handleTab.apply(this, arguments);
    break;

    case KEY_CODE.BACKSPACE:
    handleBackspace.apply(this, arguments);
    break;

    case KEY_CODE.RETURN:
    handleReturn.apply(this, arguments);
    break;

    case KEY_CODE.LBRACKET:
    handleLBrace.apply(this, arguments);
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
      this.tabStr = '\t';

    } else {
      this.tabStr = (new Array(this.props.tabSize + 1)).join(this.props.tabChar);
    }

    textAreaProps.ref = 'textarea';


    return React.createElement('textarea', textAreaProps, this.props.children);
  },

  componentDidMount: function() {
    // Bypassing React to do real stuff

    var textareaNode = this.refs.textarea.getDOMNode();
    // React can **** a **** (Issue #140 - cannot set nonstandard atttributes)
    // This defunct HTML attribute is the only way to prevent wrapping and allow tabbing.
    textareaNode.setAttribute('wrap', 'off');

    // React can **** another ****
    // It appends 'px' to the tab size, which is wrong and not accepted by the browser.
    textareaNode.style['tab-size'] = this.props.tabSize;

  }
});

module.exports = CodeArea;
