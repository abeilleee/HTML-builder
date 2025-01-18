const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const projectDistPath = path.join(__dirname, 'project-dist');
const bundleCssPath = path.join(projectDistPath, 'bundle.css');



function mergeStyles() {
    fs.rm(bundleCssPath, { recursive: true, force: true }, (err) => { //удаляю папку, чтобы обновлять содержимое
        if (err)
            console.error('Error while removing a directory', err);

        const writeStream = fs.createWriteStream(bundleCssPath);

        fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
            let count = files.length;

            if (err) {
                console.error('Error while reading the directory');
                return;
            }

            files.forEach((file) => {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    const filePath = path.join(stylesPath, file.name);

                    const readStream = fs.createReadStream(filePath, 'utf-8');
                    readStream.on("data", (chunk) => writeStream.write(chunk + '\n'));

                    readStream.on("error", (error) => {
                        console.log("Error", error.message);
                        count--;
                    });

                    readStream.on('end', () => {
                        count--;
                        if (count === 0) {
                            writeStream.end();
                            console.log('The styles merging was completed')
                        }
                    });

                } else {
                    count--;
                }
            });
        });
    });
}

mergeStyles();