var React = require('react');
var Graph = require('./graph.jsx');
 
/**
 * App is the top-level component. It fills the whole body of the page.
 */
var App = React.createClass({

    render: function() {
        return (
            <div id='app'>
                <Graph model={this.props.model} />
                <div id='AST_editor'>
                    <textarea onChange={this._onASTChange} value={JSON.stringify(this.props.model.getAST(), null, '  ')} />
                </div>
            </div>
        );
    },

    _onASTChange: function(event) {
        this.props.model.setAST(event.target.value);
    }

});

module.exports = App;
