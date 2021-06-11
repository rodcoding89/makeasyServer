var multer = require('multer');

var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './public/images/insertneed/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
module.exports.uploadneed = multer({ storage: storage });