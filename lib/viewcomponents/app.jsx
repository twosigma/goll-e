var CreditsPanel = require('./gui/panels/credits.jsx');
var GCLPanel = require('./gui/panels/gcl.jsx');
var Graph = require('./graph.jsx');
var React = require('react');
var Toolbar = require('./gui/toolbar.jsx');

/**
 * App is the top-level component. It fills the whole body of the page.
 */
 var App = React.createClass({

  render: function() {
    return (
      <div id='app'>
        <Toolbar tools={{
          gcl: {
            icon: '/images/icons/gcl.svg',
            title: 'Content Code Editor',
            panelContent: <GCLPanel model={this.props.gclEditorModel} />
          },

          credits: {
            icon: '/images/icons/about.svg',
            title: 'Credits',
            panelContent: <CreditsPanel />
          }}} />
        <Graph model={this.props.gclEditorModel.get('graph')} />
      </div>
    );
  }
});

 module.exports = App;
