var path = require('path');
var _ = require('lodash');
var context = require('./context');

function Folder(name, parent) {
  this.__private = {
    name: name,
    files: [],
    parent: parent
  };
}

Folder.prototype.isRoot = function () { return !this.__private.parent; };

Folder.prototype.add = function (generator, name, finalName) {
  if (this.has(name)) {
    generator.error('Folder ' + this.getName() + ' already has a file ' + name);
  } else {
    this.__private.files.push(new File(this, generator, name, finalName));
  }
};

Folder.prototype.override = function (generator, name, finalName) {
  this.__private.files = this.__private.files.filter(function (file) {
    return file.name !== name;
  });

  this.__private.files.push(new File(this, generator, name, finalName));
};

Folder.prototype.has = function (fileName) {
  var paths = fileName.split('/');
  if (paths.length > 1) {
    var child = paths.shift();
    return this[child] && this[child].has(paths.join('/'));
  } else {
    return this.getFiles().reduce(function (acc, file) {
      return acc || file.getName() === fileName;
    }, false);
  }
};

Folder.prototype.addFolder = function (folderName) {
  this[folderName] = new Folder(folderName, this);
};

Folder.prototype.getName = function () { return this.__private.name; };

Folder.prototype.getParent = function () { return this.__private.parent; }

Folder.prototype.getPath = function () {
  if (this.isRoot()) {
    return '';
  } else if (this.getParent().isRoot()) {
    return this.getName();
  } else {
    return path.join(this.getParent().getPath(), this.getName());
  }
};

Folder.prototype.getFiles = function () { return _.sortBy(this.__private.files, function (f) { return f.getName() }); };

Folder.prototype.getFolders = function () {
  var folders = [];
  _.forOwn(this, function (folder, folderName) {
    if (folderName !== '__private') {
      folders.push(folder);
    }
  });
  return _.sortBy(folders, function (folder) { return folder.getName(); });
};

Folder.prototype.forEachFile = function (cb) {
  this.getFolders().forEach(function (folder) {
    folder.forEachFile(cb);
  });

  this.getFiles().forEach(cb);
};

Folder.prototype.rename = function (newName) {
  var parent = this.getParent();
  if (!parent) {
    throw new Error('You cannot rename the root folder.');
  } else if (newName === this.getName()) {
    throw new Error('Please, pick a different name than the actual one.');
  } else if (parent[newName]) {
    throw new Error('A folder with this name alreay exist.');
  } else {
    // delete parent[this.getName()]
    this.__private.name = newName;
    // parent[newName] = this;
  }
};

Folder.prototype.toPOJO = function () {
  var res = {};
  this.getFolders().forEach(function (f) {
    res[f.getName()] = f.toPOJO();
  });
  this.getFiles().forEach(function (f) {
    res[f.getName()] = f.finalName || f.getName();
  });
  return res;
};

// Only reconstruct the folders for now
Folder.prototype.fromPOJO = function (pojo) {
  _.forOwn(pojo, function (value, key) {
    if (_.isPlainObject(value)) {
      this.addFolder(key);
      this[key].fromPOJO(value);
    }
  }.bind(this));
};

Folder.prototype.toString = function () {
  return this.getPath();
};

Folder.prototype.toTuples = function (onlyFolders, prefixFolder, prefixContent) {
  prefixFolder = prefixFolder ? prefixFolder + '── ' : ' ';
  prefixContent = prefixContent ? prefixContent + '   ' : ' ';

  var result = [{object: this, string: prefixFolder + this.getName()}];

  var folders = this.getFolders();
  var lastFolder = folders.length - 1;

  var files = this.getFiles();
  var lastFile = files.length - 1;
  var hasFiles = !onlyFolders && files.length > 0;

  folders.forEach(function (folder, index) {
    if (hasFiles || index !== lastFolder) {
      result = result.concat(folder.toTuples(onlyFolders, prefixContent + '├', prefixContent + '│'));
    } else {
      result = result.concat(folder.toTuples(onlyFolders, prefixContent + '└', prefixContent + ' '));
    }

    if (this.isRoot() && !onlyFolders) {
      result.push({string: ' │'});
    }
  }.bind(this));

  if (!onlyFolders) {
    files.forEach(function (file, index) {
      if (index === lastFile) {
        result.push({object: file, string: prefixContent + '└── ' + file.toString()});
      } else {
        result.push({object: file, string: prefixContent + '├── ' + file.toString()});
      }
    }.bind(this));
  }

  return result;
};

Folder.prototype.toTree = function () {
  return this.toTuples().map(function (t) { return t.string; }).join('\n');
};


function File(folder, generator, name, finalName) {
  this.folder = folder;
  this.generator = generator;
  this.name = name;
  this.finalName = finalName;
}

File.prototype.getName = function () { return this.name; };

File.prototype.getFinalName = function () {
  return this.finalName && this.generator.render(this.finalName, context) || this.getName();
};

File.prototype.getTemplatePath = function () {
  if (path.isAbsolute(this.getName())) {
    return this.getName();
  } else {
    return this.generator.templatePath(path.join(this.folder.getPath(), this.getName()));
  }
};

File.prototype.getDestinationPath = function () {
  return path.join(this.folder.getPath(), this.getFinalName());
};

File.prototype.toString = function () { return this.getFinalName() };

module.exports = {
  Folder: Folder,
  File: File
};
