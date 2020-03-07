const express = require('express');

const fs = require('fs');

const Config = require('../../../../app/services/Config');
const router = express.Router();


router.route('/colors')
    .get((req, res) => {
        const configSvc = new Config('./src/colors.json');
        configSvc.load((err, config) => {
            if (err) {
                console.log(err.message);
                process.exit();
            }
            res.json(config.colors);
        });
    
    })
    .post((req, res) => {

        // const id = uuid.v1();
        fs.readFile('./src/colors.json', 'utf8', (err, data) => {
            if (err) {
                console.log('Error Loading config file');
                return;
            }
    
           const colorObj = JSON.parse(data);
           const colors = colorObj && colorObj.colors;
    
            const newColor = {
                ...req.body,
                id: Math.max(...colors.map(c => c.id), 0) + 1,
            };
    
            colors.push(newColor);
    
           fs.writeFile(
            './src/colors.json', 
            JSON.stringify(colorObj), 
            (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
    
                res.json(newColor);
    
              }
            );
        });
    
        
    });


router.route('/colors/:colorId')
    .get((req, res) => {
        console.log('REQ PARAM', req.params.colorId);
        fs.promises.readFile('./src/colors.json')
            .then(data => {
                const db = JSON.parse(data);
                
                const color = db.colors.find(c => c.id === Number(req.params.colorId))
                
                
            })
            .catch((err) => {
                console.log(err);
                res.statusCode(500);
                res.end();
            });
    })
    .put((req, res) => {
        const colorIdParam = Number(req.params.colorId);

        if (colorIdParam < 1 || colorIdParam !== req.body.id) {
          res.sendStatus(400);
          res.end();
          return;
        }
      
        fs.promises.readFile('./src/colors.json')
          .then(data => {
      
            const db = JSON.parse(data);
            const updateColor = {
              ...req.body,
              id: colorIdParam,
            };
      
            const colorIndex = db.colors.findIndex(c => c.id === colorIdParam);
            db.colors[colorIndex] = updateColor;
      
            return fs.promises.writeFile('./src/colors.json', JSON.stringify(db));
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
        const colorIdParam = Number(req.params.colorId);

        if (colorIdParam < 1) {
            res.sendStatus(400);
            res.end();
            return;
        }

        fs.promises.readFile('./src/colors.json')
            .then(data => {

                const db = JSON.parse(data);

                const colorIndex = db.colors.findIndex(c => c.id === colorIdParam);
                db.colors.splice(colorIndex, 1);

                return fs.promises.writeFile('./src/colors.json', JSON.stringify(db));
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