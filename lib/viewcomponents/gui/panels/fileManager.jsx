var React = require('react');
var DropdownButton = require('../dropdownButton');

var FileManagerPanel = React.createClass({
  render: function() {
    return (
      <div className='file-manager-panel'>
        <div className="browser"/>

        <div className='button-bar'>
          <div className='wrapper'>
            <div className='button' onClick={this._promptUpload}>Upload</div>
            <DropdownButton label='New' items={[
              {label: 'Content', onClick: this._promptUpload.bind(this, 'content')},
              {label: 'Layout', onClick: this._promptUpload.bind(this, 'layout')},
              {label: 'Styles', onClick: this._promptUpload.bind(this, 'style')}
              ]}/>
            <DropdownButton label='Save As&hellip;' items={[
              {label: 'Content', onClick: this._promptSaveAs.bind(this, 'content')},
              {label: 'Layout', onClick: this._promptSaveAs.bind(this, 'layout')},
              {label: 'Styles', onClick: this._promptSaveAs.bind(this, 'style')}
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
