/*global describe, it */

'use strict';

var expect =  require('chai').expect
  , j = require('path').join
  , getRootSync = require('../lib/svn-project-root').sync;

describe('svn-project-root#sync', function() {

  it('should be able to get url from package.json', function() {
    var projFldr = j(__dirname, 'fixtures/svn-project-w-package-json/lib')
      , root = getRootSync(projFldr);
    expect(root).to.equal('https://svnhub.com/foo/bar');
  });

  it('should be able to get url from svn info', function() {
    var projFldr = j(__dirname, 'fixtures/blargus')
      , root = getRootSync(projFldr);
    expect(root).to.equal('http://blargus.googlecode.com/svn');
  });

});


