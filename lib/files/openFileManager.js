var createClass = require('../utilities/createClass');
var storage = require('./storage-model');

var OpenFileManager = createClass({
  constructor: function() {
    this.after('gclEditorModelChange', function(e) {
      // setup auto-save
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
        this.get('gclEditorModel').set('text', contents);
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