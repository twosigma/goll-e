var React = require("react");
var Graph = require("./graph.jsx");

/**
 * App is the top-level component. It fills the whole body of the page.
 */
var App = React.createClass({

    render: function() {
        "use strict";
        return (
            <div id='app'>
                <Graph model={this.props.model} />
            </div>
        );
    },

    _onModelChange: function(event) {
        "use strict";
        this.props.model.setContents(event.target.value);
    }

});

module.exports = App;
