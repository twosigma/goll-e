var Data = {
  _go: function(method, config, context) {
    var contentType = config.contentType || 'application/json';

    var sendData;

    if (method === 'POST') {
      // contentType = 'application/x-www-form-urlencoded';
      sendData = config.data;
    }

    return new Promise(function(resolve, reject) {

      var request = new XMLHttpRequest();
      request.open(method, config.url, true);

      request.setRequestHeader('Content-Type', contentType);

      request.onload = function() {
        var response = this.response;
        if (this.getResponseHeader('content-type').indexOf('application/json') !== -1) {
          response = JSON.parse(this.response);
        }

        if (this.status >= 200 && this.status < 400) {
          resolve.bind(context)(response);
        } else {
          reject.bind(context)(response);
        }
      };

      request.onerror = function() {
        reject(new Error('HTTP Error'));
      };

      request.send(sendData);
    });
  },

  get: function(config, context) {
    return this._go('GET', config, context);
  },

  put: function(config, context) {
    return this._go('PUT', config, context);
  },

  post: function(config, context) {
    return this._go('POST', config, context);
  },

  delete: function(config, context) {
    return this._go('DELETE', config, context);
  }
};

module.exports = Data;
