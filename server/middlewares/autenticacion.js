const jwt = require('jsonwebtoken')

/* Verificar tokem */
let verificarToken = ( req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err,decoded) => {
        if (err ) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
        next();
    });
};
/* Verifica admin rol */
let verificarAdmin_role = ( req, res, next ) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE")
        next();
    else
        res.json({
            ok: false,
            err: {
                message: 'Este usuario no tiene permisos de administrador'
            }
        })
};

module.exports = {
    verificarToken,
    verificarAdmin_role
}