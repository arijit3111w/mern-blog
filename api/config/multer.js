import multer from 'multer'

const storage = multer.diskStorage({
  filename: function (req, file, cb) {

    cb(null, file.originalname) // Use the original file name
  }
})

function fileFilter (req, file, cb) {

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg']

    // Check if the file type is allowed
    if (!allowedTypes.includes(file.mimetype)) {
       cb(new Error('Only .jpeg, .jpg, .png, .webp and .svg format allowed!'), false)
    }else{
        cb(null, true)
    }

}

const upload = multer({ storage: storage, fileFilter: fileFilter })

export default upload