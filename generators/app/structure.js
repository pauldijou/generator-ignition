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
    delete parent[this.getName()]
    this.__private.name = newName;
    parent[newName] = this;
  }
};

Folder.prototype.toString = function (prefixFolder, prefixContent) {
  var foldersSeparator = this.isRoot() ? '\n │\n' : '\n';

  prefixFolder = prefixFolder ? prefixFolder + '── ' : ' ';
  prefixContent = prefixContent ? prefixContent + '   ' : ' ';

  var folders = this.getFolders();
  var hasFolders = folders.length > 0;
  var lastFolder = folders.length - 1;

  var files = this.getFiles();
  var hasFiles = files.length > 0;
  var lastFile = files.length - 1;

  folders = folders.map(function (folder, index) {
    if (hasFiles || index !== lastFolder) {
      return folder.toString(prefixContent + '├', prefixContent + '│');
    } else {
      return folder.toString(prefixContent + '└', prefixContent + ' ');
    }
  }).join(foldersSeparator);

  files = files.map(function (file, index) {
    if (index === lastFile) {
      return prefixContent + '└── ' + file.toString();
    } else {
      return prefixContent + '├── ' + file.toString();
    }
  }).join('\n');

  return prefixFolder
    + this.getName()
    + (hasFolders ? '\n' : '')
    + folders
    + (hasFiles ? foldersSeparator : '')
    + files;
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
