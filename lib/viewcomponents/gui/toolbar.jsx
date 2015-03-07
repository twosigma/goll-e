var React = require('react');
var classSet = React.addons.classSet;

var ObjectUtils = require('../../utilities/objects');
/*
tools: an array of tool config objects keyed by name [{
  panelContent: ctor for the react component of contents of the panel,
  icon: path to icon image
  title: string titilo
}]
 */


var Toolbar = React.createClass({
  getInitialState: function() {
    return {
      activePanel: null
    }
  },

  render: function() {
    var createButtons = function() {
      var buttons = [];
      ObjectUtils.each(this.props.tools, function(toolConfig, name) {
          var clickHander = function() {
            this.setState({
              activePanel: this.state.activePanel == name ? null : name
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
        <div className="panel">
          <div className="title-bar">
            <img className="icon" src={toolConfig.icon} />
            <h2 className="title">{toolConfig.title}</h2>
          </div>
          <div className="contentBox">
          {React.createElement(toolConfig.panelContent, toolConfig.props)}
          </div>
        </div>
      );
    }.bind(this);

    return (

      <div className="toolbar">
        <div className="panel-container">{createPanel()}</div>

        <ul className="tools">
          {createButtons()}
        </ul>
      </div>

    );
  }
});

module.exports = Toolbar;
