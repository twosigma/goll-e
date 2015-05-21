var React = require('react');
var DropdownButton = require('../dropdownButton');
var FileBrowser = require('../fileBrowser');
var FileTypes = require('../../../enum/fileTypes');
var storage = require('../../../files/storage-model');
var openFileManager = require('../../../files/openFileManager');

var FileManagerPanel = React.createClass({
  getInitialState: function() {
    return {files: storage.get('files')};
  },

  componentDidMount: function() {
    storage.load();
    storage.after('filesChange', this._onFilesChange, this);
  },

  _onFilesChange: function(e) {
    this.setState({files: e.newVal});
  },

  render: function() {
    return (
      <div className='file-manager-panel'>

        <FileBrowser files={this.state.files} />

        <div className='button-bar'>
          <div className='wrapper'>
            <div className='button' onClick={this._promptUpload}>Upload
            <input type='file' ref='fileInput' style={{opacity: 0, left: 0, position: 'absolute', cursor: 'pointer'}} onChange={this._handleUpload} />
            </div>
            <DropdownButton label='New' items={[
              {label: 'Content', onClick: this._promptNew.bind(this, FileTypes.CONTENT)},
              {label: 'Layout', onClick: this._promptNew.bind(this, FileTypes.LAYOUT)},
              {label: 'Styles', onClick: this._promptNew.bind(this, FileTypes.STYLES)}
              ]}/>
            <DropdownButton label='Save As&hellip;' items={[
              {label: 'Content', onClick: this._promptSaveAs.bind(this, FileTypes.CONTENT)},
              {label: 'Layout', onClick: this._promptSaveAs.bind(this, FileTypes.LAYOUT)},
              {label: 'Styles', onClick: this._promptSaveAs.bind(this, FileTypes.STYLES)}
              ]}/>
          </div>
        </div>

      </div>
    );
  },

  _promptNew: function(type) {
    var filename = prompt('New File', 'My Great Graph.' + type.extension);
    if (filename === null) {
      return;
    }
    storage.createFile(filename, '')
    .then(function() {
      if (type === FileTypes.CONTENT) {
        openFileManager.loadGCL(filename);
      } else if (type === FileTypes.LAYOUT) {
        openFileManager.loadGLL(filename);
      }
    });
  },

  _promptSaveAs: function(type) {
    var defaultName;
    if (type === FileTypes.CONTENT) {
      defaultName = openFileManager.get('loadedGCLFilename');
    } else if (type === FileTypes.LAYOUT) {
      defaultName = openFileManager.get('loadedGLLFilename');
    }

    if (defaultName === null) {
      defaultName = 'My Great Graph.' + type.extension;
    } else {
      defaultName = 'Copy of ' + defaultName;
    }

    var filename = prompt('Save file as…', defaultName);
    if (filename === null) {
      return;
    }

    if (type === FileTypes.CONTENT) {
      openFileManager.saveGCLAs(filename);
    } else if (type === FileTypes.LAYOUT) {
      openFileManager.saveGLLAs(filename);
    } else {
      alert('Not implemented.');
    }
  },

  _handleUpload: function(e) {
    var fileInput = this.refs.fileInput.getDOMNode();

    var file = fileInput.files[0];
    var fileName = file.name;

    this._readFile(file)
    .then(function(contents) {
      storage.createFile(fileName, contents);
    });
  },

  _readFile: function(file) {
    return new Promise(function(resolve, reject) {

      var reader = new FileReader();

      reader.onload = function() {
        resolve(reader.result);
      };

      reader.onerror = function(e) {
        reject(e);
      };

      reader.readAsText(file);
    });
  }
});

module.exports = FileManagerPanel;
