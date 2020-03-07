require('dotenv').config();
const http = require('http');

const Config = require('./services/Config');
const concatStr = require('./utils');

const createWebApp = require('./services/createWebApp');
const staticContentMiddleware = require('./middleware/staticContent');
const accessLoggerMiddleware = require('./middleware/accessLogger');

const app = ({port, defaultFile, logger}) => {

    const webApp = createWebApp();
    webApp.use(accessLoggerMiddleware(logger));
    webApp.use(staticContentMiddleware(defaultFile));

    const server = http.createServer(staticContentMiddleware(defaultFile));

    server.listen(port, () => {
        console.log(concatStr('server started on port: ', port));
    });
   
};

const configSvc = new Config('./config.json');

// configSvc.load((err, config) => {
//     if (err) {
//         console.log(err.message);
//         process.exit();
//     }

//     app(config);
// });

configSvc.load()
    .then(config => {
        const logger = require('./services/Logger').createLogger(config.logFile);
        logger.log("starting application...");
        config.logger = logger;
        app(config);
    }).catch(err => {
        console.log(err.message);
        process.exit();
    });

//app(process.env.PORT || 3050);

