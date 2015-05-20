var createClass = require('../utilities/createClass');
var storage = require('./storage-model');
var FileType = require('../enum/fileTypes');
var debounce = require('lodash/function/debounce');

var OpenFileManager = createClass({
  constructor: function() {
    this.after('editorModelChange', function(e) {
      e.newVal.after('contentTextChange', function(e2) {
        if (e2.reason !== 'remoteLoading') {
          this.saveGCL();
        }
      }, this);

      var saveGLL = debounce(function() {
        this.saveGLL();
      }.bind(this), 1000);

      e.newVal.after('layoutTextChange', function(e2) {
        if (e2.reason !== 'remoteLoading') {
          saveGLL();
        }
      }, this);
    }, this);
  },

  instance: {
    saveGCL: function() {
      this._save('loadedGCLFilename', 'contentText');
    },

    saveGLL: function() {
      this._save('loadedGLLFilename', 'layoutText');
    },

    _save: function(loadedFileNameProperty, editorModelProperty) {
      var loadedFilename = this.get(loadedFileNameProperty);
      if (!loadedFilename) {
        return;
      }
      storage.updateFile(loadedFilename, this.get('editorModel').get(editorModelProperty));
    },

    loadGCL: function(filename) {
      this.saveGCL();
      this._load(filename, 'loadedGCLFilename', 'contentText');
    },

    loadGLL: function(filename) {
      this.saveGLL();
      this._load(filename, 'loadedGLLFilename', 'layoutText');
    },

    _load: function(filename, loadedFileNameProperty, editorModelProperty) {
      storage.getFile(filename).then(function(contents) {
        this.set(loadedFileNameProperty, filename);
        this.get('editorModel').set(editorModelProperty, contents, {reason: 'remoteLoading'});
      }.bind(this));
    },

    saveGCLAs: function(newFilename) {
      this._saveAs(newFilename, 'loadedGCLFilename', 'contentText');
    },

    saveGLLAs: function(newFilename) {
      this._saveAs(newFilename, 'loadedGLLFilename', 'layoutText');
    },

    _saveAs: function(newFilename, loadedFileNameProperty, editorModelProperty) {
      storage.createFile(newFilename, this.get('editorModel').get(editorModelProperty))
      .then(function() {
        this.set(loadedFileNameProperty, newFilename);
      }.bind(this));
    }
  },

  attrs: {
    loadedGCLFilename: {
      value: null
    },

    loadedGLLFilename: {
      value: null
    },

    editorModel: {
      writeOnce: true
    }
  }
});

var openFileManagerInstance = new OpenFileManager();

module.exports = openFileManagerInstance;
