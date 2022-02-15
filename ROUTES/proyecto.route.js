/*
 
    /api/proyecto

*/

const { Router } = require('express');


const { crearProyecto,actualizarProyecto,listadoProyectos,buscarProyecto,retornarPDF} = require('../CONTROLERS/proyecto.controler');
    
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

router.get('/buscar',[
            ValidarJWT
                ],buscarProyecto);  
router.get('/pdf/:data',[
            
                ],retornarPDF);  


module.exports = router