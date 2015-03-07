var React = require('react');

var CreditsPanel = React.createClass({
  render: function() {
    return (
      <div className="credits-panel">
        <p>Created for <br/><b>Two Sigma Investments</b> by</p>
        <ul>
          <li>Salvador Abate</li>
          <li>Julian Boilen</li>
          <li>John O&rsquo;Brien</li>
          <li>Morgan Cabral</li>
          <li>Robert Warren Gilmore</li>
        </ul>
        <p>at the <br/><b>Rochester Institute of Technology</b></p>
      </div>
    )
  }
});

module.exports = CreditsPanel;