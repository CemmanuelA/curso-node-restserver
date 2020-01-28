/* Puerto */
process.env.PORT = process.env.PORT || 3000;

/* Entorno */
process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';

/* Vencimiento del token 
    60 segundos
    60 minutos
    24 horas
    30 días
*/

process.env.CADUCIDAD_TOKEN = '48h'

/* SEED de autenticación */
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

/*  Google client ID */
process.env.CLIENT_ID = process.env.CLIENT_ID || '644077266586-c2cpqni90k2glg05pc5gcgmntgun0lru.apps.googleusercontent.com';
/* Base de datos */

let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}
else {
        urlDB = porcess.env.MONGODB_URL;
}

process.env.URLDB = urlDB