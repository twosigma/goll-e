var React = require('react');
var CodeArea = require('../codeArea.jsx');

var GCLPanel = React.createClass({
  render: function() {
    return (
      <div className="gcl-panel">
        <CodeArea defaultValue="hello world;" className="code-editor"/>
        <div className="button-bar">
          <div className="wrapper">
            {/*buttons must be divs with class button. <input> and <button> cannot be styled for a button bar */}
            <div className="button btn-apply">Apply</div>
            <div className="button btn-revert">Revert</div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = GCLPanel;