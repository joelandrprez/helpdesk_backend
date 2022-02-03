/*
 
    /api/proyecto

*/

const { Router } = require('express');


const { crearProyecto,actualizarProyecto,listadoProyectos} = require('../CONTROLERS/proyecto.controler');
    
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/',[
            ValidarJWT
            ],crearProyecto);

router.put('/:id',[
            ValidarJWT
                ],actualizarProyecto);

router.get('/',[
            ValidarJWT
                ],listadoProyectos);                                           

module.exports = router