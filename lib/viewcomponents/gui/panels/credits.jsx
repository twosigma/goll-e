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

        <div className="button-bar">
          <div className="wrapper">
            {/*buttons must be divs with class button. <input> and <button> cannot be styled for a button bar */}
            <div className="button">Button 1</div>
            <div className="button">Button 2</div>
            <div className="button">Button 3</div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = CreditsPanel;