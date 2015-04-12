var React = require('react');

var DropdownButton = React.createClass({
  getInitialState: function() {
    return {
      open: false
    }
  },
  render: function() {
    var classes = React.addons.classSet({
      'button': true,
      'dropdown-button': true,
      'open': !!this.state.open,
      'disabled': this.props.disabled
    });

    return (
      <div className={classes} onClick={this._onClick}>
      <span className="label">{this.props.label}</span>
        <ul className='menu'>
          {this.props.items.map(function(item, i) {
            return <li onClick={item.onClick} key={i}>{item.label}</li>
          })}
        </ul>
      </div>
    );
  },

  _onClick: function() {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      open: !this.state.open
    });
  }
});

module.exports = DropdownButton;