var multer = require('multer');
var path = require('path');
const sharp = require('sharp');
const S3 = require('aws-sdk/clients/s3');
const { nanoid } = require('nanoid')
const { Readable } = require('stream')

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_SECRET;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

function uploadFile(file) {
    
    const fileStream = Readable.from(file.buffer);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.key
    }

    return s3.upload(uploadParams).promise();
}


function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}

function deleteFile(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName,
    }

    s3.deleteObject(deleteParams).promise();
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, JPEG or PNG only!'), false);
    }
}

const storage = multer.memoryStorage();
const uploadMulter = multer({storage: storage});

const upload = uploadMulter.single('file');

const resizeImage = async (req, res, next) => {
    if (!req.file){ 
        return next(); 
    }
    
    let dimensions = sizeOf(req.file.buffer);
    console.log(dimensions.width, dimensions.height);
    

    sharp(req.file.buffer)
    .resize(840, 840)
    .toBuffer()
    .then(result => {
        
        const key = nanoid()  
    
        req.file.buffer = result;
        req.file.filename = key;
        req.file.key = key;
        

        next()
    })
    .catch(err => {
        console.error(err);
        next();
    })

}

module.exports = {
    resizeImage,
    upload,
    uploadFile, 
    getFileStream,
    deleteFile
}


// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let stringDate = new Date()
//     const year = stringDate.getFullYear().toString();
//     const month = stringDate.getMonth().toString(); 
    
//     mkdirp(`./public/uploads/${year}/${month}`)
//     cb(null,`./public/uploads/${year}/${month}`)
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    
//   }
// })