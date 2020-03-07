const http = require('http');
const path = require('path');
const fs = require('fs');


const configFileName = path.join(__dirname, './config.json');
let port = 3050;
let fileName = 'index.html';

const app = (port) => {
    
    const staticContentMiddleware = (request, response) => {
        //const indexFileName = path.join(__dirname, '/', fileName);
        //console.log("DIR NAME", __dirname);
        const indexFileName = path.join(__dirname, '..', 'public', fileName);
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

        // fs.writeFile('', data, (err) => {
        //     if (err) throw err;
        //     console.log('The file has been saved!');
        //   });
    };
    
     
    const server = http.createServer(staticContentMiddleware);
    server.listen(port, () => {
        console.log('Server is listening on port', port);
    });


};

fs.readFile(configFileName, 'utf8', (err, data) => {
    if (err) {
        console.log('Error Loading config file');
        return;
    }
    let configObj = JSON.parse(data);
    console.log('READ CONFIG', configObj);
    port = configObj.port;
    fileName = configObj.defaultFileName;
    app(port);
});


