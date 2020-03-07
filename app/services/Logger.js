
const fs = require('fs');
const _logger = {};

class Logger {
    constructor(logFileName) {
        console.log("Creating a new Logger");
        this._logFile = logFileName;
    }

    log(message) {
        const time = new Date().toLocaleString();
        fs.appendFile(
            this._logFile, 
            time + ' ' + message +'\n', 
            'utf8', 
            () => {}
            );
    }
}

module.exports = {
    createLogger: (logFile) => {
        if (!_logger[logFile]) {
            _logger[logFile] = new Logger(logFile);
        }
        return _logger[logFile];
    }
};