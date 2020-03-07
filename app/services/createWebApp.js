


const createWebApp = () => {
    const middleWareFns = [];
    const webApp = (req, res) => {
        middleWareFns.forEach(middleWareFn => middleWareFn(req, res));
    };

    webApp.use = (middleWareFn) => {
        middleWareFns.push(middleWareFn);

    };

    return webApp;
};

module.exports = createWebApp;