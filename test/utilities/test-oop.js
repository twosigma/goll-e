var should = require('should');
var Oop = require('./../../lib/utilities/oop');
var ObjectUtils = require('./../../lib/utilities/objects');

describe('oop utils', function() {
  describe('#augment', function() {

    it('should not break the receiver', function(done) {
      var constructorCalled = false;
      var myObject;
      var ReceiverClass = function() {
        constructorCalled = true;
      };

      ReceiverClass.prototype.untouchedMethod = function() {
        this.should.be.exactly(myObject);
        done();
      };

      var ProviderClass = function() {};
      ProviderClass.prototype.unused = function(){};

      Oop.augment(ReceiverClass, ProviderClass);

      myObject = new ReceiverClass();
      myObject.unused();

      myObject.should.be.instanceOf(ReceiverClass);
      constructorCalled.should.be.true;

      myObject.untouchedMethod();

    });

    it('should call the provider\'s constructor', function(done) {
      var ReceiverClass = function() {
      };
      var myObject;

      var ProviderClass = function() {
        this.should.be.exactly(myObject);
        done();
      };

      ProviderClass.prototype.providerMethod = function(){};

      Oop.augment(ReceiverClass, ProviderClass);

      myObject = new ReceiverClass();
      myObject.providerMethod();

    });

    it('should override with methods from the provider', function(done) {
      var myObject;

      var ReceiverClass = function() {
      };
      ReceiverClass.prototype.myMethod = function() {
        throw 'Method was not overridden';
      };

      var ProviderClass = function() {};
      
      ProviderClass.prototype.myMethod = function(){
        this.should.be.exactly(myObject);
        done();
      };

      Oop.augment(ReceiverClass, ProviderClass);

      myObject = new ReceiverClass();
      myObject.myMethod();
    });
  });
});