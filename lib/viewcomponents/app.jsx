var React = require('react');
var Graph = require('./graph.jsx');
 
/**
 * App is the top-level component. It fills the whole body of the page.
 */
var App = React.createClass({

    render: function() {
        return (
            <div id='app'>
                <Graph model={this.props.graphModel} />
            </div>
        );
    },

    _onModelChange: function(event) {
        this.props.model.setContents(event.target.value);
    }

});

module.exports = App;
