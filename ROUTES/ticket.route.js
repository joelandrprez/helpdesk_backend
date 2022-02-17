/*
 
    /api/ticket

*/

const { Router } = require('express');


const { crearTicket,
        traerListaTicketporUsuario,
        AsignacionTicketAtencionCliente,
        traerListalistaAsginacion,
        EdicionTicketDesarrollo,
        ListaTicketDesarrollo,
        traerProyectoCLiente,
        ListaDesarroladores, 
        AnularTicketCliente,
        ActualizarTicketCliente,
        Busquedapordescripcion,
        MuestraTicketGeneral,
        FinalizarTicket} = require('../CONTROLERS/ticket.controler');
    
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');



const router = Router();

router.post('/',[
            ValidarJWT
            ],crearTicket);     
            
router.get('/',[
            ValidarJWT
            ],traerListaTicketporUsuario);     


            /* consultas de atencion al cliente */
router.put('/:id',[
            ValidarJWT
            ],AsignacionTicketAtencionCliente);  
            
router.get('/listaAsginacion',[
            ValidarJWT
            ],traerListalistaAsginacion);                 
            /* fin consultas de atencion al cliente */


            /* consultas del area de desarrollo */
router.put('/desarrollo/:id',[
            ValidarJWT
            ],EdicionTicketDesarrollo);  
            
router.get('/listaAsginacionDesarrollo',[
            ValidarJWT
            ],ListaTicketDesarrollo);                 
            /* fin  consultas del area de desarrollo*/

router.get('/listaProyectosClientes',[
            ValidarJWT
            ],traerProyectoCLiente);    
            
router.get('/ListaDesarroladores',[
            ValidarJWT
            ],ListaDesarroladores);               
            
router.put('/AnularTicketUsuario/:id',[
            ValidarJWT
            ],AnularTicketCliente);         
router.put('/ActualizarTickerUsuario/:id',[
            ValidarJWT
            ],ActualizarTicketCliente);                
router.get('/busquedapornombre/:id',[
                ValidarJWT
                ],Busquedapordescripcion);      

router.get('/muestraTicketGeneral',[
                ValidarJWT
                ],MuestraTicketGeneral);  

router.put('/finticketresuelto/:id',[
                ValidarJWT
                ],FinalizarTicket);                 
                
module.exports = router