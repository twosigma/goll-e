var CreditsPanel = require('./gui/panels/credits.jsx');
var GCLPanel = require('./gui/panels/gcl.jsx');
var GLLPanel = require('./gui/panels/gll.jsx');
var FileManagerPanel = require('./gui/panels/fileManager.jsx');
var GraphCanvas = require('./graphCanvas.jsx');
var React = require('react');
var Toolbar = require('./gui/toolbar.jsx');

/**
 * App is the top-level component. It fills the whole body of the page.
 * Singleton
 */
var App = React.createClass({

  render: function() {
    return (
      <div id='app'>
        <Toolbar tools={{
          fileManager: {
            icon: '/images/icons/fileManager.svg',
            title: 'File Browser',
            panelContent: <FileManagerPanel />
          },

          gcl: {
            icon: '/images/icons/gcl.svg',
            title: 'Content Code Editor',
            panelContent: <GCLPanel model={this.props.editorModel} />
          },

          gll: {
            icon: '/images/icons/gll.svg',
            title: 'Layout Code Editor',
            panelContent: <GLLPanel model={this.props.editorModel} />
          },

          credits: {
            icon: '/images/icons/about.svg',
            title: 'Credits',
            panelContent: <CreditsPanel />
          }}} />
        <GraphCanvas rootGraph={this.props.editorModel.get('graph')} />
      </div>
    );
  }
});

module.exports = App;
