const express = require('express');
const app = express();

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

app.post('/login', (req,res) => {
    res.json({
        ok: true
    });
});



module.exports = app;