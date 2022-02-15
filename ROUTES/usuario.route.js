/*
 
    /api/usuarios

*/

const { Router } = require('express');

const { actualizarUsuario,
    crearUsuario, 
    listadoUsuarios,
    listadoClientes} = require('../CONTROLERS/usuario.controler');

const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/', [
    ValidarJWT
], crearUsuario);

router.put('/:id', [
    ValidarJWT
], actualizarUsuario);

router.get('/', [
    ValidarJWT
], listadoUsuarios);

router.get('/clientes', [
    ValidarJWT
], listadoClientes);


module.exports = router