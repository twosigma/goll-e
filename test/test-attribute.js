var should = require('should');
var Attribute = require('./../lib/attribute/attribute');
var ObjectUtils = require('./../lib/utilities/objects');



describe('attribute', function() {

    var Model = function() {};
    ObjectUtils.mix(Model.prototype, Attribute.prototype);

    var myModel;

    beforeEach(function() {
        myModel = new Model();
        myModel._initAttributes();
    });

    it('should configure and retrieve a simple attribute', function() {
        myModel.addAttr('myAttr', {
            value: 'a'
        });

        myModel.get('myAttr').should.equal('a');
    });

    it('should return undefined when not set', function() {
        ((typeof myModel.get('noneSuch') === 'undefined')).should.be.ok;
    });

    it('should allow setting of valid property', function() {
        myModel.addAttr('myAttr', {
            value: 'a',
            validator: function(val) {
                return val === 'b';
            }
        });

        myModel.set('myAttr', 'b');

        myModel.get('myAttr').should.equal('b');
    });

    it('should disallow setting of invalid property', function() {
        myModel.addAttr('myAttr', {
            value: 'a',
            validator: function(val) {
              return val === 'b';
          }
        });

        myModel.set('myAttr', 'c');

        myModel.get('myAttr').should.equal('a');
    });

    it('should disallow setting a readonly property', function() {
      myModel.addAttr('myAttr', {
          value: 'a',
          readOnly: true
    });

      myModel.set('myAttr', 'b');
      myModel.get('myAttr').should.equal('a');

    });

    describe('valueFn (config parameter)', function() {
        it('should work with a func literal', function() {
            myModel.addAttr('myAttr', {
                value: 'a',
                valueFn: function() {
                  return 'b';
                }
              }
            );

            myModel.get('myAttr').should.equal('b');

            myModel.set('myAttr', 'c');
            myModel.get('myAttr').should.equal('c');
          
        });

        it('should work with an instance method', function() {
            myModel.myMethod = function() {
              return 'd';
            };

            // string to reference instance method
            myModel.addAttr('myAttr2', {
                value: 'e',
                valueFn: 'myMethod'
              }
            );

            myModel.get('myAttr2').should.equal('d');
          
        });
    });

    it('should disallow setting a writeOnce twice', function() {
      myModel.addAttr('myAttr', {
          value: 'a',
          writeOnce: true
        });

      myModel.set('myAttr', 'b');
      myModel.get('myAttr').should.equal('b');

      myModel.set('myAttr', 'c');
      myModel.get('myAttr').should.equal('b');
    });

    
    describe('getAttrs', function() {
      it('should return a mapping of all attrs', function() {
        myModel.addAttrs({
            attr1: {
                value: 1
            },
            attr2: {
                value: 2
            },
            attrNull: {
                value: null
            }
        });

        var expected = {
            attr1: 1,
            attr2: 2,
            attrNull: null
        };

        var result = myModel.getAttrs();

        ObjectUtils.each(expected, function(expectedValue, expectedKey) {
          result.should.have.property(expectedKey, expectedValue);
        });

      });
    });
});
