const express = require('express');
const fs = require('fs');

const router = express.Router();

router.route('/cars')
  .get((req, res) => {

    fs.readFile('./src/cars.json', (err, data) => {
  
      if (err) {
        console.log(err);
        res.sendStatus(500);
        res.end();
      }
  
      const db = JSON.parse(data);
      res.json(db.cars);
  
    });
  
  })
  .post((req, res) => {

    fs.promises.readFile('./src/cars.json')
      .then(data => {
  
        const db = JSON.parse(data);
        const newCar = {
          ...req.body,
          id: Math.max(...db.cars.map(c => c.id), 0) + 1,
        };
  
        db.cars.push(newCar);
  
        return fs.promises.writeFile('./src/cars.json', JSON.stringify(db))
          .then(() => newCar);
      })
      .then((newCar) => {
        res.json(newCar);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        res.end();
      });
  
  });

router.route('/cars/:carId')
  .get((req, res) => {

    fs.readFile('./src/cars.json', (err, data) => {
  
      if (err) {
        console.log(err);
        res.sendStatus(500);
        res.end();
      }
  
      const db = JSON.parse(data);
  
      const car = db.cars.find(
        c => c.id === Number(req.params.carId)
      );
      
      if (!car) {
        res.sendStatus(404);
        res.end();
      }
      
      res.json(car);
  
    });
  
  })
  .put((req, res) => {

    const carIdParam = Number(req.params.carId);
  
    if (carIdParam < 1 || carIdParam !== req.body.id) {
      res.sendStatus(400);
      res.end();
      return;
    }
  
    fs.promises.readFile('./src/cars.json')
      .then(data => {
  
        const db = JSON.parse(data);
        const updateCar = {
          ...req.body,
          id: carIdParam,
        };
  
        const carIndex = db.cars.findIndex(c => c.id === carIdParam);
        db.cars[carIndex] = updateCar;
  
        return fs.promises.writeFile('./src/cars.json', JSON.stringify(db));
      })
      .then(() => {
        res.sendStatus(204);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        res.end();
      });
  
  })
  .delete((req, res) => {

    const carIdParam = Number(req.params.carId);
  
    if (carIdParam < 1) {
      res.sendStatus(400);
      res.end();
      return;
    }
  
    fs.promises.readFile('./src/cars.json')
      .then(data => {
  
        const db = JSON.parse(data);
  
        const carIndex = db.cars.findIndex(c => c.id === carIdParam);
        db.cars.splice(carIndex, 1);
  
        return fs.promises.writeFile('./src/cars.json', JSON.stringify(db));
      })
      .then(() => {
        res.sendStatus(204);
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
        res.end();
      });
  
  });

module.exports = router;