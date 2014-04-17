# SVN Project Root (WIP)

> Get the root url for your svn project

## Usage

```javascript
var getRoot = require('svn-project-root');

// Optionally specify a start directory as first param, defaults to
process.cwd(). Directory // must be above your package.json or inside a svn repo
getRoot(function(err, url) {
  if(err) {
    // Whoops!
  }
  // Do something with url
});

try {
  // Optionally you may pass a directory
  var url = getRoot.sync();
} catch(err) {
  // Whoops!
}
// Do something with url

var grossSvnUrl = 'http://jtrussell@foobar.com/fldr/branches/featureXYZ'
  , prettyUrl = getRoot.normalize(grossSvnUrl);
console.log(prettyUrl);
// --> 'http://foobar.com/fldr'
```

## LICENSE

MIT
