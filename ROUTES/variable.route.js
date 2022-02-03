/*
 
    /api/variable

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearVariable,actualizarVariable, traerListaVariables } = require('../CONTROLERS/variables.controler');

const { validarCampos } = require('../MIDDLEWARES/validar-campos.middleware');
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');


const router = Router();


router.post('/', 
                        [ValidarJWT], 
                        crearVariable);

router.put('/:id', 
                        [ValidarJWT], 
                        actualizarVariable);                          

router.get('/', 
                        [ValidarJWT], 
                        traerListaVariables);                               

module.exports = router