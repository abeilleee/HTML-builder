const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(filePath, { flags: 'a' }); //флаг а, чтобы добавлять данные в конец, а не перезаписывать файл после exit

//интерфейс для чтения пользовательского ввода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userInput = () => {
    rl.question("Please write here your text (for exit write 'exit' or press ctrl+c): ", (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('You stopped the input process, good luck!');
            rl.close();
            output.end();
        } else {
            output.write(input + '\n');
            userInput();
        }
    });
};

//если завершаем через ctrl+c
rl.on('SIGINT', () => {
    console.log('\n\You stopped the input process, good luck!');
    rl.close();
});

userInput();
