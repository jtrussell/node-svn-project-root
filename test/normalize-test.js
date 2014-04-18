/*global describe, it */

'use strict';

var expect =  require('chai').expect
  , normalize = require('../lib/svn-project-root').normalize;

describe('svn-project-root#normalize', function() {

  it('should chop away `trunk`', function() {
    var actual = normalize('http://foobar.com/fldr/trunk/blargus');
    expect(actual).to.equal('http://foobar.com/fldr');
  });

  it('should chop away `branches`', function() {
    var actual = normalize('http://foobar.com/fldr/branches/blargus');
    expect(actual).to.equal('http://foobar.com/fldr');
  });

  it('should chop away `tags`', function() {
    var actual = normalize('http://foobar.com/fldr/tags/blargus');
    expect(actual).to.equal('http://foobar.com/fldr');
  });

  it('should chop at first occurrance of `trunk|branches|tags`', function() {
    expect(normalize('http://foobar.com/fldr/trunk/branches/tags/blargus'))
      .to.equal('http://foobar.com/fldr');
    expect(normalize('http://foobar.com/fldr/branches/trunk/tags/blargus'))
      .to.equal('http://foobar.com/fldr');
    expect(normalize('http://foobar.com/fldr/tags/branches/trunk/blargus'))
      .to.equal('http://foobar.com/fldr');
  });

  it('should filter out auth creds (username only)', function() {
    var actual = normalize('http://jtrussell@foobar.com/fldr/trunk/blargus');
    expect(actual).to.equal('http://foobar.com/fldr');
  });

  it('should filter out creds (username + pw)', function() {
    var actual = normalize('http://jtrussell:secret@foobar.com/fldr');
    expect(actual).to.equal('http://foobar.com/fldr');
  });

});
