var FileTypes = {
  CONTENT: Object.freeze({extension: 'gcl'}),
  LAYOUT: Object.freeze({extension: 'gll'}),
  STYLES: Object.freeze({extension: 'gsl'})
};

var reverseMap = {};
Object.keys(FileTypes).forEach(function(key) {
  reverseMap[FileTypes[key].extension] = FileTypes[key];
});

FileTypes.fromExtension = function(ext) {
  return reverseMap[ext];
};

module.exports = Object.freeze(FileTypes);
