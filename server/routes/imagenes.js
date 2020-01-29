const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img',[ verificaTokenImg ] ,( req, res )=> {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg =  path.resolve(__dirname, `../../uploads/${tipo}/${ img }`);
    if ( fs.existsSync(pathImg) ) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/node.png');
        res.sendFile(pathNoImg);

    }
    // let pathImg = `./uploads/${ tipo }/${ img }`;

});

module.exports = app;