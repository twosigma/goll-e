var React = require('react');
var storage = require('../../files/storage-model');
var openFileManager = require('../../files/openFileManager');

var FileBrowser = React.createClass({
  render: function() {
    return (
      <div className='file-browser'>
        <ol className='file-list'>
        {this.props.files.map(function(file, i) {
          return (
            <li key={i} onClick={this._handleOpen.bind(this, file.filename)} >
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
  },

  _handleOpen: function(filename) {
    if (openFileManager.get('loadedGCLFilename') === null) {
      alert('The unsaved file will be discarded.');
    }
    //TODO switch for different file types. For now assume GCL.
    openFileManager.loadGCL(filename);
  }
});

module.exports = FileBrowser;
