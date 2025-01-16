const path = require('path');
const fs = require('fs');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('Error while reading the directory: ', err);
        return;
    }
    files.forEach((file) => {
        if (file.isFile()) {
            const filePath = path.join(secretFolderPath, file.name);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error while getting information about file: ', err);
                    return;
                }
                const fileName = path.parse(file.name).name;
                const fileExtension = path.extname(file.name).slice(1);
                const fileSize = stats.size;

                console.log(`${fileName} - ${fileExtension} - ${fileSize}b`);
            })
        }
    })
});
