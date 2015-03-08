var React = require('react');
var CodeArea = require('../codeArea.jsx');

var GCLPanel = React.createClass({
  render: function() {
    return (
      <div className="gcl-panel">
        <CodeArea defaultValue="hello world;" className="code-editor"/>
        {/* good example of panel's button-bar styles. Must done in this way. div.button-bar:last-child > div.wrapper > div.button
        <input> and <button> cannot be styled for a button bar :-( */}
        <div className="button-bar">
          <div className="wrapper">
            <div className="button btn-revert disabled">Revert</div>
            <div className="button btn-apply">Apply</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = GCLPanel;
