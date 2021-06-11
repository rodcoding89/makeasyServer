var multer = require('multer');

var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './public/images/insertad/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
module.exports.uploadad = multer({ storage: storage });