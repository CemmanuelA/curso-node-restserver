const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload({ useTempFiles: true }));

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.put('/upload/:tipo/:id', ( req, res ) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    if ( !req.files )
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    let tiposValidos = ['productos', 'usuarios'];
    if ( tiposValidos.indexOf(tipo) < 0 ) { 
        res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposValidos.join(', ')}`,

            }
        })
    }
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length -1];

    /* Extenciones permitidas */
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`,
                ext: extension
            }
        });
    }

    // cambiar nombre archivo
    let nuevoNombreArchivo= `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, ( err ) => {
        if ( err )
            return res.status(500).json({
                ok: false,
                err,
            });
        
        if (tipo === 'usuarios') 
            imagenUsuario(id, res, nuevoNombreArchivo);
        else
            imagenProducto(id, res, nuevoNombreArchivo);
    })
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, ( err, usuarioDB ) => {
        if ( err ) {
            borraArchivo(nombreArchivo, 'usuarios');
        
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !usuarioDB ) { 
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        borraArchivo(usuarioDB.img, 'usuarios');
       
        usuarioDB.img = nombreArchivo;
        usuarioDB.save( ( err, usuarioGuardado ) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
        
    })
}

function imagenProducto(id, res, nombreArchivo ) {
    Producto.findById(id, ( err, productoDB ) => {
        if ( err ) {
            borraArchivo(nombreArchivo, 'productos');
            res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !productoDB ) {
            borraArchivo(nombreArchivo, 'productos');
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro el producto'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos' );

        productoDB.img = nombreArchivo;
        productoDB.save(( err, productoGuardado ) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImg, tipo) {
    let pathImg =  path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImg }`);
    if ( fs.existsSync(pathImg) ) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;
