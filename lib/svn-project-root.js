
'use strict';

var join = require('path').join
  , fs = require('fs')
  , findup = require('findup')
  , svnInfo = require('svn-info')
  , normalize;

/**
 * Get the normalized project root url
 * 
 * Determines the root url for this svn project:
 *
 * - Looks in DIR and ancestors for a package.json.
 *   - [has package.json?] Check for `svn` repo type and a url listing
 *   - [no package.json?] Run `svn-info` from CWD and work with reported url
 *
 * @param {String} dir [optional=CWD] The directory to start looking in
 * @param {Function} cb The callback, gets a possible error and the url path
 */
module.exports = function(dirIn, cb) {
  if(!cb) {
    cb = dirIn;
    dirIn = process.cwd();
  }

  fs.realpath(dirIn, function(err, dir) {
    if(err) { return cb(err); }

    var getRootFromSvnInfo = function() {
      svnInfo(dir, function(err, info) {
        if(err) { return cb(err); }
        return cb(null, normalize(info.url));
      });
    };

    findup(dir, 'package.json', function(err, pkgDir) {
      if(err) {
        if('not found' === err.message) {
          return getRootFromSvnInfo();
        } else {
          return cb(err);
        }
      }
      var pkg = require(join(pkgDir, 'package.json'));
      if(pkg.repository && 'svn' === pkg.repository.type && pkg.repository.url) {
        return cb(null, normalize(pkg.repository.url));
      } else {
        return getRootFromSvnInfo();
      }
    });
  });
};

/**
 * Returns the normalized project root url
 *
 * Same as the async version but the detected and normalized url is returned
 * rather than passed to a callback.
 *
 * @return {String} The root url
 */
module.exports.sync = function(dirIn) {
  dirIn =  dirIn || process.cwd();

  var dir = fs.realpathSync(dirIn)
    , pkgDir
    , findupErr;

  try {
    pkgDir = findup.sync(dir, 'package.json');
  } catch(err) {
    // Could not find package.json?
    if('not found' !== err.message) {
      findupErr = err;
    }
  }

  // Not finding package.json is OK... other errors should be reported
  if(findupErr) { throw findupErr; }

  // Maybe the package.json file has the svn repo endpoints?
  if(pkgDir) {
    var pkg = require(join(pkgDir, 'package.json'));
    if(pkg.repository && 'svn' === pkg.repository.type && pkg.repository.url) {
      return normalize(pkg.repository.url);
    }
  }

  // Not info in package.json? Welp. Ask svn!
  var info = svnInfo.sync(dir);

  // svnInfo.sync should throw if this is not a working copy
  return normalize(info.url);
};

/**
 * Normalize a svn project url
 *
 * In particular:
 *
 * - Strip away [trunk|branches|tags]
 * - Remove embedded auth creds
 *
 * @param {String} url The url to normalize
 * @return {String} The normalized url
 */
normalize = module.exports.normalize = function(url) {
  var pUrl = require('url').parse(url);

  // First chop everything after first occurance of trunk|branches\tags
  var roots = ['trunk', 'branches', 'tags']
    , urlParts = pUrl.pathname.split('/').filter(function(p) { return p.length > 0;})
    , numParts = urlParts.length
    , ixRoots = [numParts];

  urlParts.forEach(function(part, ixPart) {
    if(roots.indexOf(part) > -1) {
      ixRoots.push(ixPart);
    }
  });

  ixRoots.sort();
  urlParts.splice(ixRoots[0]);

  var choppedUrl = urlParts.join('/')
    , finalUrl = choppedUrl;

  // url.parse takes care of the auth stuff for us
  if(pUrl.protocol) {
    var host = pUrl.port ? pUrl.hostname + ':' + pUrl.port : pUrl.hostname;
    if(choppedUrl.length) {
      finalUrl = pUrl.protocol + '//' + [host, choppedUrl].join('/');
    } else {
      finalUrl = pUrl.protocol + '//' + host;
    }
  }
  
  return finalUrl;
};
