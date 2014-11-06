/**
 * The module containing the Main Golle App that starts everything
 * @module golle-app
 */
YUI.add('golle-app', function(Y) {
  var MainApp =
  /**
   * The entry point to GOLL-E.
   * Call `start` to get things going.
   * 
   * @class MainApp
   * @namespace GOLLE
   * @extends Base
   * @contructor
   */
  Y.namespace('GOLLE').MainApp =
  Y.Base.create('MainApp', Y.Base, [], {

    start: function() {
      Y.one('body').addClass('yui3-skin-sam');
      var dataInputWidget = new Y.GOLLE.Widget.RawDataInput({
        render: '#raw-data-editor-container',
        data: TEST_DATA
      });


      //TODO: setup, load data
      var graph = this._graphWidget = new Y.GOLLE.Widget.GraphWidget({data: TEST_DATA});
      graph.render('#graph-container');

      dataInputWidget.after('dataChange', function(e) {
        graph.set('data', e.newVal);
      });
    }

  }, {

    ATTRS:{
      // all graph data
    }
  });
}, '1.0', {
  requires:[
    'base',
    'golle-widget-graphwidget',
    'golle-widget-raw-data-input',
    'panel'
  ]
});


//initialize!
YUI().use('golle-app', function(Y) {
  var app = new Y.GOLLE.MainApp();
  app.start();
});

TEST_DATA = IO.read('public/test-data-1.json');
