const { v4: uuid } = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {

        if (file.fieldname == 'avatar'){
            callBack(null, 'uploads/avatar')
        } else if (file.fieldname == 'banner'){
            callBack(null, 'uploads/banner')
        } else if (file.fieldname == 'image'){
            callBack(null, 'uploads/posts')
        } else {
            callBack(new Error('Unexpected file upload'));
        }
    },
    filename: (req, file, callBack) => {
        let ext = '';
        if (file.mimetype == 'image/png'){
            ext = '.png';
        } else if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            ext = '.jpg'
        } else {
            callBack(new Error('Unsupported media type'));
            return;
        }
        callBack(null, `${uuid()}${ext}`);
    }
  })

let upload = multer({storage: storage})

module.exports = upload;