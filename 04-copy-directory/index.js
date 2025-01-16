const path = require('path');
const fs = require('fs');

function copyDir() {
    const newFolderPath = path.join(__dirname, 'files-copy');
    const firstFolderPath = path.join(__dirname, 'files');

    const newFolder = fs.mkdir(newFolderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error while creating a directory', err);
            return;
        } else {
            console.log('The directory was created successfully');
        }
    })

    fs.readdir(firstFolderPath, (err, files) => {
        if (err) {
            console.error('Error while reading the directory', err);
            return;
        } else {
            files.forEach((file) => {
                const firstFolderFile = path.join(firstFolderPath, file);
                const newFolderFile = path.join(newFolderPath, file);
                fs.copyFile(firstFolderFile, newFolderFile, (err) => {
                    if (err) {
                        console.log('Error Found: ', err);
                    } else {
                        console.log(`Copy file: ${file}`);
                    }
                })
            })
        }
    })
}
copyDir();
