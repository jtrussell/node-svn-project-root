# SVN Project Root (WIP)

> Get the root url for your svn project

## Usage

```javascript
var getRoot = require('svn-project-root');

// Optionally specify a start directory, defaults to process.cwd(). Directory
// must be above your package.json or inside a svn repo
getRoot(['/some/dir',] function(err, url) {
  if(err) {
    // Whoops!
  }
  // Do something with url
});

try {
  var url = getRoot.sync(['/some/dir']);
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
