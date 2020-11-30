const pgk = require('./package.json');
const fs = require('fs');

let version = {};
try {
  version = require('./version.json');
} catch (e) {
  console.info(e);
}

module.exports.checkVersion = function () {
  if (version && version.updated === false) {
    console.log("App version not updated. Please update the application version by using 'npm version'")
    process.exit(1);
  }

  process.exit(0);
};

module.exports.writeVersion = function () {
  const pkgVersion = pgk.version.split('.');
  fs.writeFile('version.json', JSON.stringify({
    major: pkgVersion[0] || 0,
    minor: pkgVersion[1] || 0,
    patch: pkgVersion[2] || 0,
    updated: true
  }), function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    process.exit(0);
  });
};

module.exports.invalidateVersion = function () {
  fs.writeFile('version.json', JSON.stringify({
    ...version,
    updated: false
  }), function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    process.exit(0);
  });
};
