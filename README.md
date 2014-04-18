# SVN Project Root

> Get the root url for your svn project

## Usage

### svn-project-root

This module exports a function which asynchronously determines the project root
for your svn repository. 

```javascript
var doSomethingWithRoot = function(err, root) {
  // Handle error, do something with root
};

var getRoot = require('svn-project-root');

getRoot(doSomethingWithRoot);

// CWD not in the project you care about? You can pass directory path as
// thefirst parameter.
var otherProjectFldr = '/other/project/folder';
getRoot(otherProjectFldr, doSomethingWithRoot);
```

### svn-project-root#sync

The synchronous flavor of the above method. This may throw an error if for
example there is a problem parsing your project's `package.json` or if the
project in question is not an svn repository.

```javascript
var getRoot = require('svn-project-root')
  , otherProjectFldr = '/other/project/folder'
  , projectRoot;

try {
  projectRoot = getRoot.sync();
} catch(err) {
  // boo!
}

// or

try {
  projectRoot = getRoot.sync(otherProjectFldr);
} catch(err) {
  // boo!
}

// Do something with root
```

### svn-project-root#normalize

Our method for normalizing svn urls is also exported. If you already have a svn
url handy and just want to get the project root from that url the method may
satisfy your needs.

Usernames and passwords will be stripped away and the url will be chopped down
to just before `trunk|branches|tags` start.

```javascript
var uglyUrl = 'https://jtrussell@svnhub.com/fldr/branches/assets/scripts'
  , normalize = require('svn-project-root').normalize;
console.log(normalize(uglyUrl));
// --> 'https://svnhub.com/fldr'
```

## Usage Examples

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

## Limitations

### Assumption: Sane folder names

This module assumes your svn project directory structure looks like:

```
/
  /<arbitrary-folders>
    /<root>
      /trunk
      /branches
      /tags
```

The root or your project is assumed to be the parent directory of the first
occurrence of `trunk|branches|root`, if you structure your repo such that it's
svn url looks like `https://svnhub.com/trunk/trunk/trunk/branches/foo` you may
have problems. I.e. please do not name repo ancestors `trunk|branches|tags`.

### Assumption: First valid package.json is the one you want

`svn-project-root` will grab your repo url from the `repository.url` field in
the first `package.json` it sees in the passed directory (defaults to
`process.cwd()`) or any of its ancestors where the following is true:

- `repository.type` is set and equals `'svn'`
- `repository.url` is set

## Tests

Tests are run with [grunt][1] and [mocha][2].

```shell
grunt test
```

## License

MIT

[1]: http://gruntjs.com/ "Grunt"
[2]: http://visionmedia.github.io/mocha/ "Mocha"
