var React = require('react');
var Graph = require('./graph.jsx');

var Toolbar = require('./gui/toolbar.jsx');
var toolbarConfig = require('./gui/ToolbarConfig');
 
/**
 * App is the top-level component. It fills the whole body of the page.
 */
var App = React.createClass({

    render: function() {
        return (
            <div id='app'>
                <Toolbar tools={toolbarConfig} />
                <Graph model={this.props.graphModel} />
            </div>
        );
    },

    _onModelChange: function(event) {
        this.props.model.setContents(event.target.value);
    }

});

module.exports = App;
