var React = require('react');
var CodeArea = require('../codeArea.jsx');

var CodePanel = React.createClass({
  // props.code is the restore point, and state.code is the current value of the editor
  getInitialState: function() {
    return {
      code: this.props.code
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      code: nextProps.code
    });
  },

  render: function() {
    var dirty = this.state.code !== this.props.code;
    return (
      <div className='gcl-panel'>
        <CodeArea value={this.state.code} className='code-editor' onChange={this._onCodeChange}/>
        {/* good example of panel's button-bar styles. Must done in this way. div.button-bar:last-child > div.wrapper > div.button
        <input> and <button> cannot be styled for a button bar :-( */}
        <div className='button-bar'>
          <div className='wrapper'>
            <div className={'button btn-revert ' + (dirty ? '' : 'disabled')} onClick={this._revert}>Revert</div>
            <div className={'button btn-apply ' + (dirty ? '' : 'disabled')} onClick={this._apply}>Apply</div>
          </div>
        </div>
      </div>
    );
  },

  _onCodeChange: function(event) {
    this.setState({
      code: event.target.value
    });
  },

  _apply: function() {
    // this.props.model.set('text', this.state.code);
    this.props.changesApplied(this.state.code);
  },

  _revert: function() {
    this.setState({
      code: this.props.code
    });
  }
});

module.exports = CodePanel;
