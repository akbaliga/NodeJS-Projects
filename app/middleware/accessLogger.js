

const accessLogger = (logger) => (req, res) => {
    logger.log(req.url);
};

module.exports = accessLogger;