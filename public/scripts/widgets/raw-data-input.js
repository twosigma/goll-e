/**
 * The module containing RawDataInput
 * @module widget-raw-data-input
 */
YUI.add('golle-widget-raw-data-input', function(Y) {
  var RawDataInput =
  /**
   * For the initial prototype only.
   * 
   * A dialog that lets users view and edit the raw node data.
   * @class RawDataInput
   * @namespace Widget
   * @extends Widget
   * @uses 
   * @contructor
   */
   Y.namespace('GOLLE.Widget').RawDataInput =
   Y.Base.create('RawDataInput', Y.Base, [], {

    initializer: function() {
      var code = JSON.stringify(this.get('data'), null, 2);
      var initialHTML = Y.Lang.sub(RawDataInput.HTML_TEMPLATE, {code: code});

      this._dialog = new Y.Panel({
        contentBox : Y.Node.create('<div id="dialog" />'),
        bodyContent: initialHTML,
        width: 410,
        height: 600,
        zIndex: 6,
        modal: false, // modal behavior
        render: '.example',
        visible: true, // make visible explicitly with .show()
        plugins: [Y.Plugin.Drag],
        context: this,
        x: Y.one('body').getComputedStyle('width').match(/[0-9]*/)[0] - 420,
        y: 20,
        buttons: {
          footer: [
            {
              name  : 'update',
              label : 'Update',
              action: Y.bind(this._handleUpdate, this)
            }
          ]
        }
      });

      // dialog.get('boundingBox').addClass('raw-data-input');
    },

    _handleUpdate: function() {
      var code = this._dialog.get('contentBox').one('.raw-data-input-field').get('value');
      if (!code) {
        return;
      }

      var data = Y.JSON.parse(code);
      this.set('data', data);
    }

  }, {
    CSS_PREFIX: 'raw-data-input',

    HTML_TEMPLATE: '<textarea name="data" class="raw-data-input-field">{code}</textarea>' +
    '',

    ATTRS:{
      data: {
        value: {},
        validator: Y.Lang.isObject
      },

      render: {}

    }
  });
}, '1.0', {
  requires:[
    'panel',
    'base',
    'dd-plugin',
    'json'
  ]
});