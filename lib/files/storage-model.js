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
      var sendFile = new Promise(function(resolve, reject) {
        var formData = new FormData();
        formData.append('filename', name);

        var contentBlob = new Blob([content], {type: 'text/plain'});
        formData.append('contents', contentBlob);

        var request = new XMLHttpRequest();
        request.open('POST', StorageModel.BASE_URL, true);

        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            resolve(this.response);
          } else {
            reject(this.response);
          }
        };

        request.onerror = function() {
          reject(this.response);
        };

        request.send(formData);
      });

      return sendFile
      .then(function() {
        this.load();
      }.bind(this));
    },

    deleteFile: function(name) {
      return Data.delete({
        url: StorageModel.BASE_URL + '/' + encodeURIComponent(name)
      }).then(function() {
        this.load();
      }.bind(this));
    },

    updateFile: function(name, content) {
      return this.createFile(name, content);
    },

    getFile: function(name) {
      return Data.get({
        url: StorageModel.BASE_URL + '/' + encodeURIComponent(name)
      });
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
