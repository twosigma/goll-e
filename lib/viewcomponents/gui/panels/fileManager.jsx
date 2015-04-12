var React = require('react');
var DropdownButton = require('../dropdownButton');
var FileBrowser = require('../fileBrowser');
var FileTypes = require('../../../enum/fileTypes');

var FileManagerPanel = React.createClass({
  render: function() {
    return (
      <div className='file-manager-panel'>

        <FileBrowser />

        <div className='button-bar'>
          <div className='wrapper'>
            <div className='button' onClick={this._promptUpload}>Upload</div>
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
  }
});

module.exports = FileManagerPanel;
