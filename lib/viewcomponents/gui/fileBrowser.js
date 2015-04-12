var React = require('react');

var FileBrowser = React.createClass({
  render: function() {
    var generateItem = function() {
      // tmp for unwired testing
      return (
        <li>
          <div className='icon' />
          <div className='filename'>myGreatFile.gcl</div>
          <div className='actions'>
            <div className='delete'/>
          </div>
        </li>);
    };

    return (
      <div className='file-browser'>
        <ol className='file-list'>
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
          {generateItem()}
        </ol>
      </div>
      );
  }
});

module.exports = FileBrowser;