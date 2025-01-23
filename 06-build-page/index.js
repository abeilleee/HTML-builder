const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const stylesCopyPath = path.join(projectDistPath, 'style.css');
const assetsFolder = path.join(__dirname, 'assets');
const assetsCopyPath = path.join(projectDistPath, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');


fs.rm(projectDistPath, { recursive: true, force: true }, (err) => { 
    if (err)
        console.error('Error while removing a directory', err);


    fs.mkdir(projectDistPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error while creating a directory', err);
            return;
        }

        fs.readFile(templatePath, 'utf-8', (err, templateData) => {
            if (err) {
                console.error('Error while reading tepmlate.html', err);
            }
   
            fs.readdir(componentsPath, (err, files) => {
                if (err) {
                    console.error('Error while reading components folder');
                }
          
                const components = {};
                let count1 = 0;

                files.forEach((component) => {
                    if (path.extname(component) === '.html') {
                        const nameOfComponent = path.basename(component, path.extname(component));

                        fs.readFile(path.join(componentsPath, component), 'utf-8', (err, data) => {
                            if (err) {
                                console.error('Error while reading a component', err);
                            }
                            components[nameOfComponent] = data;
                            count1++;

                            if (count1 === files.length) {
                                let result = templateData;

                              
                                for (const [name, content] of Object.entries(components)) {
                                    const tag = `{{${name}}}`;
                                    result = result.replace(new RegExp(tag, 'g'), content);
                                }

                                    fs.writeFile(path.join(projectDistPath, 'index.html'), result, (err) => {
                                    if (err) {
                                        console.error("File index.html wasn't created", err);
                                    } else {
                                        console.log('File index.html was created successfully');
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("ERROR while reading files from components, index.html file wasn't created, be sure components folder has only html files!!!");
                    }
                });
            });
        });

        //создание файла style.css в project dist
        fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error('Error while reading the directory');
                return;
            }

            const writeStream = fs.createWriteStream(stylesCopyPath);
            let count = files.length;

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

        //копирование файлов из assets
        function copyDirectory(src, destinationPath) {
            fs.mkdir(destinationPath, { recursive: true }, (err) => {
                if (err) {
                    console.error('Error while creating a copy of folder assets', err);
                }

                fs.readdir(src, (err, files) => {
                    let count = 0;

                    if (err) {
                        console.error('Errow while reading the directory', err);
                        return;
                    } else {
                        files.forEach((file) => {
                            const srcFile = path.join(src, file);
                            const destinationFile = path.join(destinationPath, file);

                            fs.stat(srcFile, (err, stat) => {
                                if (err) {
                                    console.error('Error while reading stat', err);
                                }

                                if (stat.isDirectory()) {
                                    copyDirectory(srcFile, destinationFile);
                                } else {
                                    fs.copyFile(srcFile, destinationFile, (err) => {
                                        if (err) {
                                            console.error('Errow while copying a file', err);
                                        }
                                        count++;
                                        if (count === files.length) {
                                            console.log('The folder from assets was copied successfully');
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }
        copyDirectory(assetsFolder, assetsCopyPath);
    });
});