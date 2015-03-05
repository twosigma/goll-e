var should = require('should');
var Attribute = require('./../lib/utilities/attribute');
var ObjectUtils = require('./../lib/utilities/objects');
var createClass = require('./../lib/utilities/createClass');


describe('attribute', function() {

    var Model = createClass();

    var myModel;

    beforeEach(function() {
        myModel = new Model();
    });

    it('should configure and retrieve a simple attribute', function() {
        myModel.addAttr('myAttr', {
            value: 'a'
        });

        myModel.get('myAttr').should.equal('a');
    });

    it('should fail when getting a nonexistant attr', function() {
        myModel.get.bind(myModel, 'noneSuch').should.throw();
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
                    this.should.be.exactly(myModel);
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

    it('should support a setter function', function() {
      myModel.addAttr('myAttr', {
          value: 0,
          setter: function(val) {
            this.should.be.exactly(myModel);
            return val + 1;
          }
        });

      myModel.set('myAttr', 2);
      myModel.get('myAttr').should.equal(3);
    });

    it('should support a getter function', function() {
      myModel.addAttr('myAttr', {
          value: 2,
          getter: function(val) {
            this.should.be.exactly(myModel);
            return val * 5;
          }
        });

      myModel.get('myAttr').should.equal(2*5);
    });

    it('should fire a change event', function(done) {
      myModel.addAttr('myAttr', {
          value: 1
        });

      myModel.after('myAttrChange', function(event) {
        event.newVal.should.equal(2);
        event.prevVal.should.equal(1);
        event.source.should.be.exactly(myModel);
        done();
      });
      myModel.set('myAttr', 2);
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
