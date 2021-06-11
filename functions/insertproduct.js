var multer = require('multer');

var storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './public/images/insertproduct/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
module.exports.uploadproduct = multer({ storage: storage });