const fs = require('fs');
const path = require('path');

const staticContent = (defaultFile) => (request, response) => {

    
    const indexFileName = path.join(__dirname, '..', 'public', defaultFile);
    // In node, the first param to the callback is always an error object
    fs.readFile(indexFileName, 'utf8', (err, data) => {
        if (err) {
            response.statusCode = 500;  
            response.end();
            return;
        }
        response.statusCode = 200;  
        response.setHeader('Content-Type', 'text/html');
        response.end(data);

    });
};

module.exports = staticContent;