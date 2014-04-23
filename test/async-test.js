/*global describe, it */

'use strict';

var expect =  require('chai').expect
  , j = require('path').join
  , getRoot = require('../lib/svn-project-root');

describe('svn-project-root', function() {

  it('should be able to get url from package.json', function(done) {
    getRoot(j(__dirname, 'fixtures/svn-project-w-package-json/lib'), function(err, root) {
      expect(err).to.equal(null);
      expect(root).to.equal('https://svnhub.com/foo/bar');
      done();
    });
  });

  it('should be able to get url from svn info', function(done) {
    getRoot(j(__dirname, 'fixtures/blargus'), function(err, root) {
      expect(err).to.equal(null);
      expect(root).to.equal('http://blargus.googlecode.com/svn');
      done();
    });
  });

});

