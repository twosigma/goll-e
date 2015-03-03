var React = require('react');
var Graph = require('./graph.jsx');

/**
 * App is the top-level component. It fills the whole body of the page.
 */
var App = React.createClass({

  render: function() {
    var gclEditorModel = this.props.gclEditorModel;
    return (
      <div id='app'>
        <div id='editorPanel'>
          <button id='autoLayout' onClick={this._onAutoLayoutClick}>
            perform automatic layout
          </button>
          <textarea onChange={this._onGCLChange}>
            {gclEditorModel.get('text')}
          </textarea>
        </div>
        <Graph model={gclEditorModel.get('graphModel')} />
      </div>
    );
  },

  _onGCLChange: function(event) {
    this.props.gclEditorModel.set('text', event.target.value);
  }

});

module.exports = App;
