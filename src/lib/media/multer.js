import multer, { diskStorage } from 'multer';
import crypto  from   'node:crypto'
import { AppError } from '../error/error.js';
import { allowedFields } from './file.validation.js';
// storage
// 1. disk [hdd]
//    folder   >>
//    filename >>
// 2. memory [ram]



function multerUpload(allowedTypes = allowedFields.images) {
  return  multer( {

    fileFilter: function (req, file, cb){
        // ['image/png, image/jpeg'] >> 'application/pdf'
        if (!allowedTypes.includes(file.mimetype)){
           return cb(new AppError('invalid file format', 400), false)
        }
        cb(null, true)
    },
    storage: diskStorage({
        destination: 'uploads',
        filename: function (req, file, cb){
            cb(null, `${crypto.randomUUID()}-${file.originalname}`)
        }
    })
})
}


export function uploadSingleFile(filename, allowedTypes = allowedFields.images) {
    return multerUpload(allowedTypes).single(filename)
}


export function uploadFilesArray(filename, maxcount) {
    return multerUpload().array(filename, maxcount)
}

export function uploadFields(fields) {
    return multerUpload().fields(fields)
}

