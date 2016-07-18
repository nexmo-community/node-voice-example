var CallTracker = require('../lib/CallTracker');
var config = require('./test-config');

var expect = require('expect.js');

describe('CallTracker', function () {
  
  var ct = new CallTracker(config);
  var from = '555';
  var to = '999';
  var ncco = ct.answer(from, to);

  it('should create an NCCO with two elements', function() {
    expect(ncco.length).to.be(2);
  });
  
  it('should create an NCCO with a record first element', function() {
    var first = ncco[0];
    expect(first.action).to.be('record');
  });
  
  it('should create an NCCO with a record action with eventUrl Array', function() {
    var first = ncco[0];
    expect(first['eventUrl']).to.be.an('array');
    
    var expectedUrl = `${config.base}/recording?from=${from}&to=${to}`;
    expect(first['eventUrl'][0]).to.be(expectedUrl)
  });
  
  it('should create an NCCO with a connect second element', function() {
    var second = ncco[1];
    expect(second.action).to.be('connect');
  });
  
  it('should create an NCCO with a connect action with from value', function() {
    var second = ncco[1];
    expect(second.from).to.be(from);
  });
  
  it('should create an NCCO with a connect action with eventUrl Array', function() {
    var second = ncco[1];
    expect(second['eventUrl']).to.be.an('array');
    
    var expectedUrl = `${config.base}/event`;
    expect(second['eventUrl'][0]).to.be(expectedUrl)
  });
  
  it('should create an NCCO with a connect action with endpoint Array', function() {
    var second = ncco[1];
    expect(second['endpoint']).to.be.an('array');
    expect(second['endpoint'].length).to.be(1);
  });
  
  it('should create an NCCO with a connect action with phone endpoint', function() {
    var second = ncco[1];
    var endpoint = second['endpoint'][0];
    expect(endpoint.type).to.be('phone');
    expect(endpoint.number).to.be(config.proxyToNumber);
  });
  
});
