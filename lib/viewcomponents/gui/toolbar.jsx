var React = require('react');
var classSet = React.addons.classSet;

var ObjectUtils = require('../../utilities/objects');

var Panel = require('./panel.jsx');
/*
tools: an object of tool config objects keyed by name {
  panelContent: constructed component of contents of the panel,
  icon: path to icon image
  title: string title of panel
  props: any props to pass to the panel
}
 */


var Toolbar = React.createClass({
  propTypes: {
    tools: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      tools: {}
    };
  },

  getInitialState: function() {
    return {
      activePanel: null
    };
  },

  render: function() {
    var createButtons = function() {
      var buttons = [];
      ObjectUtils.each(this.props.tools, function(toolConfig, name) {

        var clickHander = function() {
          // make active panel clicked panel. If already active, close panel (make null).
          this.setState({
            activePanel: this.state.activePanel === name ? null : name
          });
        }.bind(this);

        var classPredicates = {};
        classPredicates.button = true;
        classPredicates.active = this.state.activePanel === name;
        classPredicates['button-' + name] = !!name;
        var classes = classSet(classPredicates);

        buttons.push(
          <li key={name} onClick={clickHander} title={toolConfig.title} className={classes} >
            <img src={toolConfig.icon}/>
          </li>
        );
      }, this);

      return buttons;
    }.bind(this);

    var createPanel = function() {
      if (this.state.activePanel === null) {
        return null;
      }
      var toolConfig = this.props.tools[this.state.activePanel];

      return (
        <Panel title={toolConfig.title} icon={toolConfig.icon}>
          {toolConfig.panelContent}
        </Panel>
      );
    }.bind(this);

    return (

      <div className="toolbar">
        <div className="panel-container">
          {createPanel()}
        </div>

        <ul className="tools">
          {createButtons()}
        </ul>
      </div>

    );
  }
});

module.exports = Toolbar;
