var multer = require('multer');
var path = require('path');
const mkdirp = require('mkdirp');
const sharp = require('sharp');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let stringDate = new Date()
    const year = stringDate.getFullYear().toString();
    const month = stringDate.getMonth().toString(); 
    
    mkdirp(`./public/uploads/${year}/${month}`)
    cb(null,`./public/uploads/${year}/${month}`)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    
  }
})
const upload = multer({storage: storage});
// const upload = multer({dest: './public/uploads/'})

const uploadFile = upload.single('file');

const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  

  await sharp(req.file.path)
    .resize(288, 160)
    .toFile(path.resolve(req.file.destination, 'resized-' + req.file.filename))
  req.file.new_filename = req.file.destination + '/resized-' + req.file.filename
  next()
}

module.exports = {
    resizeImage,
    uploadFile
}