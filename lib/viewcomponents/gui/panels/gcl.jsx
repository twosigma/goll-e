var React = require('react');
var CodeArea = require('../codeArea.jsx');

var GCLPanel = React.createClass({
  getInitialState: function() {
    return {
      code: this.props.model.get('contentText')
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.model.get('contentText') !== this.props.model.get('contentText')) {
      this.setState({
        code: nextProps.model.get('contentText')
      });
    }
  },

  render: function() {
    var dirty = this.state.code !== this.props.model.get('contentText');
    return (
      <div className='gcl-panel'>
        <CodeArea value={this.state.code} className='code-editor' onChange={this._onGCLChange}/>
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

  _onGCLChange: function(event) {
    this.setState({
      code: event.target.value
    });
  },

  _apply: function() {
    this.props.model.set('contentText', this.state.code);
  },

  _revert: function() {
    this.setState({
      code: this.props.model.get('contentText')
    });
  }
});

module.exports = GCLPanel;
