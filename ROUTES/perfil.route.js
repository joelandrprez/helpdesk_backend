/*
 
    /api/perfil

*/

const { Router } = require('express');
const { traerPerfil, actualizarPerfil } = require('../CONTROLERS/perfil.controler');


const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');


const router = Router();

router.get('/',[
                ValidarJWT
                ],traerPerfil);

router.put('/:id',[
                ValidarJWT
                ],actualizarPerfil);

                                               

module.exports = router