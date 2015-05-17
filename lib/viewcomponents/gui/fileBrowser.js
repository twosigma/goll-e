var React = require('react');
var storage = require('../../files/storage-model');

var FileBrowser = React.createClass({
  render: function() {
    return (
      <div className='file-browser'>
        <ol className='file-list'>
        {this.props.files.map(function(file, i) {
          return (
            <li key={i}>
              <div className='icon' />
              <div className='filename'>{file.filename}</div>
              <div className='actions'>
                <div className='delete' onClick={this._handleDelete.bind(this, file.filename)}/>
              </div>
            </li>);
        }.bind(this))}
        </ol>
      </div>
      );
  },

  _handleDelete: function(filename) {
    storage.deleteFile(filename);
  }
});

module.exports = FileBrowser;
