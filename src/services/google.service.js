const { google } = require('googleapis');
const path = require('path');
const fs = require('fs')

const getDriveService = () => {
    const KEYFILEPATH = path.join(__dirname, '../../filekey.json');
    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
};

const uploadFile = async (fileObject) => {

    const { data } = await getDriveService().files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: fs.createReadStream(fileObject.path),
        },
        requestBody: {
            name: fileObject.filename,
            parents: ['1hoSOOaKujfIfpPp2IatMKAlNK70PhWKi'],
        },
        fields: 'id,name',
    });

    console.log(`Uploaded file ${data.name} ${data.id}`);
};

module.exports = { uploadFile };