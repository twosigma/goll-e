var React = require('react');
var storage = require('../../files/storage-model');
var openFileManager = require('../../files/openFileManager');
var FileType = require('../../enum/fileTypes');

var confirmUnsaved = function() {
  return !!confirm('The unsaved file will be discarded. Load file anyway?');
};

var FileBrowser = React.createClass({
  render: function() {
    return (
      <div className='file-browser'>
        <ol className='file-list'>
        {this.props.files.map(function(file, i) {
          var isOpen = file.filename === openFileManager.get('loadedGCLFilename') || file.filename === openFileManager.get('loadedGLLFilename');
          return (
            <li key={i} onClick={this._handleOpen.bind(this, file.filename)} className={isOpen ? 'selected' : ''}>
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

  _handleDelete: function(filename, e) {
    e.preventDefault();
    storage.deleteFile(filename);
  },

  _handleOpen: function(filename) {
    var extMatch = filename.match(/\.([a-z]{3})$/);
    var type;

    if (extMatch) {
      type = FileType.fromExtension(extMatch[1]);
    }

    var loadedFilename;
    if (type === FileType.CONTENT) {
      loadedFilename = openFileManager.get('loadedGCLFilename');
      if (loadedFilename === null && !confirmUnsaved()) {
        return;
      }
      openFileManager.loadGCL(filename);
    } else if (type === FileType.LAYOUT) {
      loadedFilename = openFileManager.get('loadedGLLFilename');
      if (loadedFilename === null && !confirmUnsaved()) {
        return;
      }
      openFileManager.loadGLL(filename);
    } else {
      alert('Not a supported file type.');
      return;
    }
  }
});

module.exports = FileBrowser;
