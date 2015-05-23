var _ = require('lodash');

function Folder(name, parent) {
  this.__private = {
    name: name,
    files: [],
    parent: parent
  };
}

Folder.prototype.isRoot = function () { return !this.__private.parent; };

// If only we had the magic "..." operator...
Folder.prototype.add = function () {
  this.__private.files.push(new File(this, arguments[0], arguments[1], arguments[2]));
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
    return this.getParent().getPath() + '/' + this.getName();
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

Folder.prototype.toString = function () {
  return this.getName();
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

File.prototype.getTemplatePath = function () {
  return this.folder.getPath() + (this.folder.isRoot() ? '' : '/') + this.name;
};

File.prototype.getDestinationPath = function () {
  return this.folder.getPath() + (this.folder.isRoot() ? '' : '/') + (this.finalName || this.name);
};

File.prototype.toString = function () { return this.getName(); };

module.exports = {
  Folder: Folder,
  File: File
};
