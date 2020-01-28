const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


/* Obtener todos los productos */
app.get('/producto',[ verificarToken], ( req, res ) => {
    let desde = req.params.desde || 0;
    desde = Number(desde);
    let limite = req.params.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
    .populate('usuario', 'nombre _id email ')
    .populate('categoria', 'descripcion')
    .skip(desde)
    .limit(limite)
    .exec(( err , productos ) => {
        if ( err ) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        });
    });
});

/* Obtener producto por id */
app.get('/producto/:id', [verificarToken], ( req, res ) => {

    let id = req.params.id;
    Producto.findOne({ _id: id })
    .populate('usuario', 'nombre _id email ')
    .populate('categoria', 'descripcion')
    .exec( ( err, producto ) => {
        if ( err ) {
            res.status(500).json({
                ok: false,
                err : {
                    message: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: producto
        })
    });
});

/* Buscar en  productos */
app.get('/producto/buscar/:termini',[ verificarToken], ( req, res ) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
    .populate('usuario', 'nombre _id email ')
    .populate('categoria', 'descripcion')
    .exec(( err , productos ) => {
        if ( err ) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        });
    });
});
/* Crear producto */
app.post('/producto',[verificarToken], ( req, res ) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

/* Actualizar producto */
app.put('/producto/:id', verificarToken, ( req, res ) => {
    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni
    };
    let id = req.params.id;
    Producto.findByIdAndUpdate( id, body, {new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

/* Borrar producto */
app.delete('/producto/:id', ( req, res ) => {
    let id =  req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true}, ( err , productoBorrado ) => {
        if ( err ) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if( !productoBorrado ) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
});



module.exports = app;