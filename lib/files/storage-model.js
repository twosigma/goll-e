var createClass = require('../utilities/createClass');
var Data = require('../utilities/data');

var StorageModel = createClass({
  instance: {
    load: function() {
      Data.get({
        url: StorageModel.BASE_URL,
        context: this
      }).then(function(data) {
        this.set('files', data);
      }.bind(this));
    },

    createFile: function(name, content) {
      Data.post({
        url: StorageModel.BASE_URL,
        data: JSON.stringify({
          filename: name,
          contents: content
        })
      }).then(function() {
        this.load();
      }.bind(this));
    },

    deleteFile: function(name) {
      Data.delete({
        url: StorageModel.BASE_URL + '/' + encodeURIComponent(name)
      }).then(function() {
        this.load();
      }.bind(this));
    }
  },



  attrs: {
    files: {
      value: []
    }
  },

  statics: {
    BASE_URL: '/api/graphs'
  }
});

// Global singleton
var storage = new StorageModel();

module.exports = storage;