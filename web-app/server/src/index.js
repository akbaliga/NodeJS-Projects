const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const colorsRouter = require('./routers/colors');
const carsRouter = require('./routers/cars');

const app = express();


//add a 'body' property to the req obj
app.use('/api', bodyParser.json());
app.use('/api', colorsRouter);
app.use('/api', carsRouter);



app.use('/', proxy('localhost:3000'));

app.listen(4200, () => {
    console.log('Web Server listening on port 4200');
});





