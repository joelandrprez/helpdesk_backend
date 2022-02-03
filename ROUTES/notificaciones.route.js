/*
 
    /api/notificaciones

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { listaSolicitudesporUsuario } = require('../CONTROLERS/notificaciones.controler');

const { validarCampos } = require('../MIDDLEWARES/validar-campos.middleware');
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');


const router = Router();

router.get('/', 
                        [ValidarJWT], 
                        listaSolicitudesporUsuario);                               

module.exports = router