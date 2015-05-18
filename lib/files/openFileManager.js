var createClass = require('../utilities/createClass');
var storage = require('./storage-model');

var OpenFileManager = createClass({
  constructor: function() {
    this.after('gclEditorModelChange', function(e) {
      e.newVal.after('textChange', function(e2) {
        if (e2.reason !== 'remoteLoading') {
          this.saveGCL();
        }
      }, this);
    }, this);
  },

  instance: {
    saveGCL: function() {
      var loadedFilename = this.get('loadedGCLFilename');
      if (!loadedFilename) {
        return;
      }
      storage.updateFile(loadedFilename, this.get('gclEditorModel').get('text'));
    },

    loadGCL: function(filename) {
      storage.getFile(filename).then(function(contents) {
        this.saveGCL();
        this.set('loadedGCLFilename', filename);
        this.get('gclEditorModel').set('text', contents, {reason: 'remoteLoading'});
      }.bind(this));
    },

    saveGCLAs: function(newFilename) {
      storage.createFile(newFilename, this.get('gclEditorModel').get('text'))
      .then(function() {
        this.set('loadedGCLFilename', newFilename);
      }.bind(this));
    }
  },

  attrs: {
    loadedGCLFilename: {
      value: null
    },

    gclEditorModel: {
      writeOnce: true
    }
  }
});

var openFileManagerInstance = new OpenFileManager();

module.exports = openFileManagerInstance;
