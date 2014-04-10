# SVN Project Root (WIP)

> Get the root url for your svn project

## Usage

```javascript
var getRoot = require('svn-project-root');

getRoot(function(err, url) {
  if(err) {
    // Whoops!
  }
  // Do something with url
});

try {
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
