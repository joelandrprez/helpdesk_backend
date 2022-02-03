/*
 
    /api/permisos

*/

const { Router } = require('express');
const { crearPermiso, mostrarPermisos } = require('../CONTROLERS/permisos.controler');

const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/', [
                    ValidarJWT
                ], crearPermiso);
router.post('/per', [
                    ValidarJWT
                ], mostrarPermisos);                


module.exports = router