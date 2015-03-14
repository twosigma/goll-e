var React = require('react');
var GraphCanvas = require('./graphCanvas.jsx');

/**
 * App is the top-level component. It fills the whole body of the page.
 * Singleton
 */
var App = React.createClass({

  render: function() {
    var gclEditorModel = this.props.gclEditorModel;
    return (
      <div id='app'>
        <div id='model_editor'>
          <textarea onChange={this._onGCLChange} defaultValue={gclEditorModel.get('text')}>
          </textarea>
        </div>
        <GraphCanvas rootGraph={gclEditorModel.get('graph')} />
      </div>
    );
  },

  _onGCLChange: function(event) {
    this.props.gclEditorModel.set('text', event.target.value);
  }

});

module.exports = App;
