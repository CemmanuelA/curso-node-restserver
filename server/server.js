require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('./routes/usuario'));
app.get('/', (req, res) => {
    res.json('Hola mundo');
});



mongoose.connect(process.env.URLDB,
                {useNewUrlParser: true, useCreateIndex: true }, (err,res) => {
    if (err) throw err;

    console.log('Base da datos global')
});

app.listen(process.env.PORT, () =>{
    console.log('escuchando puerto 3000');
});