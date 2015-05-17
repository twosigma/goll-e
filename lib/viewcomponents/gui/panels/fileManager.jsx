var React = require('react');
var DropdownButton = require('../dropdownButton');
var FileBrowser = require('../fileBrowser');
var FileTypes = require('../../../enum/fileTypes');
var storage = require('../../../files/storage-model');

var FileManagerPanel = React.createClass({
  getInitialState: function() {
    return {files: storage.get('files')};
  },

  componentDidMount: function() {
    storage.load();
    storage.after('filesChange', function(e) {
      this.setState({files: e.newVal});
    }, this);
  },

  render: function() {
    return (
      <div className='file-manager-panel'>

        <FileBrowser files={this.state.files} />

        <div className='button-bar'>
          <div className='wrapper'>
            <div className='button' onClick={this._promptUpload}>Upload
            <input type='file' ref='fileInput' style={{opacity: 0, left:0, position: 'absolute', cursor: 'pointer'}} onChange={this._handleUpload} />
            </div>
            <DropdownButton label='New' items={[
              {label: 'Content', onClick: this._promptUpload.bind(this, FileTypes.CONTENT)},
              {label: 'Layout', onClick: this._promptUpload.bind(this, FileTypes.LAYOUT)},
              {label: 'Styles', onClick: this._promptUpload.bind(this, FileTypes.STYLES)}
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

  _promptUpload: function() {
    //TODO
  },
  _promptNew: function(type) {
    //TODO
  },

  _promptSaveAs: function(type) {
    // TODO
  },

  _handleUpload: function(e) {
    var fileInput = this.refs.fileInput.getDOMNode();

    var file = fileInput.files[0];
    var fileName = file.name;

    this._readFile(file).then(function(contents) {
      storage.createFile(fileName, contents);
    }.bind(this));
  },

  _readFile: function(file) {
    return new Promise(function(resolve, reject) {

      var reader = new FileReader();

      reader.onload = function(e) {
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
