var should = require('should');
var EventTarget = require('../lib/utilities/eventTarget');
var ObjectUtils = require('../lib/utilities/objects');

describe('event target', function() {
  var eventTarget;

  beforeEach(function() {
    eventTarget = new EventTarget();
  });

  it('should fire and an \'on\' event', function(done) {
    var testCtx = {};
    eventTarget.on('myEvent', function(e, extraArg) {
      extraArg.should.equal('extra');
      this.should.be.exactly(testCtx);
      done();
    }, testCtx, 'extra')

    eventTarget.fire('myEvent');
  });

  it('should fire and an \'after\' event when defaultfn completed', function(done) {
    var defaultfnRan = false;

    eventTarget.on('myEvent', function(e, extraArg) {
      defaultfnRan.should.be.false;
    });

    eventTarget.after('myEvent', function(e, extraArg) {
      defaultfnRan.should.be.true;
      done();
    });

    eventTarget.fire('myEvent', function() {
      defaultfnRan = true;
    });

    eventTarget.fire('done');
  });

  it('should have preventable events', function() {

    eventTarget.on('myEvent', function(e, extraArg) {
      e.preventDefault();
    });

    eventTarget.after('myEvent', function(e, extraArg) {
      throw 'After event ran on prevented event';
    });

    eventTarget.fire('myEvent', function() {
      throw 'Default function ran on prevented event';
    });
  });

  it('should have detachable events', function() {
    var firstReceive = true;

    var handle = eventTarget.on('myEvent', function(e) {
      firstReceive.should.be.true;
      firstReceive = false;
      handle.detach();
    });

    eventTarget.fire('myEvent');
    eventTarget.fire('myEvent');
    eventTarget.fire('myEvent');
  });
});
