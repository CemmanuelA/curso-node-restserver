const express = require('express');

let { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');


/* Retorna todas las categorias */
app.get('/categoria', ( req, res ) => {

    Categoria.find({}, 'nombre descripcion')
    .sort('descripcion')
    .populate('Usuario', 'nombre _id email')
    .exec(( err, categorias ) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    });

});

/* Retorna una categoria por id */
app.get('/categoria/:id', ( req, res ) => {

    Categoria.findOne({_id: req.params.id}, 'nombre descripcion')
    .exec( (err, categoria ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encontro la categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});


/* Crear una categoria */
app.post('/categoria', verificarToken, ( req, res ) => {
    let body = req.body;
    let categoria = new Categoria({
        usuario: req.usuario._id,
        descripcion: body.descripcion
    });

    categoria.save( (err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    } )

});

/* Actualziar una categoria por id */
app.put('/categoria/:id', verificarToken,  ( req, res ) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, {descripcion: body.descripcion}, { new: true, runValidators: true }, ( err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });


});
/* Eliminar una catergoria por id */
app.delete('/categoria/:id', [verificarToken, verificarAdmin_role],  ( req, res ) => {

    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndRemove(id, ( err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    mesagge: "el id no existe"
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria borrada"
        })
    });
});

module.exports = app;