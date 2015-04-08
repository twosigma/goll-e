var React = require('react');

var Panel = React.createClass({

  render: function() {
    return (
      <div className='panel'>
        <div className='title-bar'>
          <img className='icon' src={this.props.icon} />
          <h2 className='title'>{this.props.title}</h2>
        </div>
        <div className='contentBox'>
          {/*React.createElement(this.props.panelContent, this.props.props)*/}
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = Panel;
