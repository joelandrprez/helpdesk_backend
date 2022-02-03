/*
 
    /api/ticket

*/

const { Router } = require('express');


const { crearTicket,traerListaTicketporUsuario } = require('../CONTROLERS/ticket.controler');
    
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/',[
            ValidarJWT
            ],crearTicket);     
            
router.get('/',[
            ValidarJWT
            ],traerListaTicketporUsuario);                

module.exports = router