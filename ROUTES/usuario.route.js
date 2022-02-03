/*
 
    /api/usuarios

*/

const { Router } = require('express');

const { actualizarUsuario,
        crearUsuario } = require('../CONTROLERS/usuario.controler');
        
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/',[
                ValidarJWT
                ],crearUsuario);

router.put('/:id',[
                ValidarJWT
                ],actualizarUsuario);

                                               

module.exports = router