var createClass = require('../utilities/createClass');
var storage = require('./storage-model');

var OpenFileManager = createClass({
  constructor: function() {
    this.after('editorModelChange', function(e) {
      e.newVal.after('contentTextChange', function(e2) {
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
      storage.updateFile(loadedFilename, this.get('editorModel').get('contentText'));
    },

    loadGCL: function(filename) {
      storage.getFile(filename).then(function(contents) {
        this.saveGCL();
        this.set('loadedGCLFilename', filename);
        this.get('editorModel').set('contentText', contents, {reason: 'remoteLoading'});
      }.bind(this));
    },

    saveGCLAs: function(newFilename) {
      storage.createFile(newFilename, this.get('editorModel').get('contentText'))
      .then(function() {
        this.set('loadedGCLFilename', newFilename);
      }.bind(this));
    }
  },

  attrs: {
    loadedGCLFilename: {
      value: null
    },

    editorModel: {
      writeOnce: true
    }
  }
});

var openFileManagerInstance = new OpenFileManager();

module.exports = openFileManagerInstance;
