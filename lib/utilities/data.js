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
        var parsed;
        try {
          parsed = JSON.parse(this.response);
        } catch (e) {
          reject(new Error('Invalid JSON'));
        }

        if (this.status >= 200 && this.status < 400) {
          resolve.bind(context)(parsed);
        } else {
          reject.bind(context)(parsed);
        }
      };

      request.onerror = function() {
        reject(new Error('HTTP Error'));
      };

      request.send(sendData);

      // Y.io(config.url, {
      //   method: method,
      //   headers: {
      //     'Content-Type': contentType
      //   },
      //   data: Y.QueryString.stringify(config.data),
      //   on: {
      //     success: handleComplete(resolve),
      //     failure: handleComplete(reject)
      //   },
      //   context: context
      // });
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
