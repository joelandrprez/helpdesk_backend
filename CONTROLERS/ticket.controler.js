const { request,response } = require('express')
const bcrypt = require('bcryptjs');


const Tickect = require('../MODELS/ticket.model');
const Notificacion = require('../MODELS/notificaciones.model');


const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');

let currentDate = moment().format('YYYY-MM-DD')
    
let currentTime = moment().format('hh:mm:ss')

let valorFormulario = 'tickets'


const crearTicket = async(req,res=response) => {

    
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/crearTicket'
        }) 
    }


    try {
        const usuarioToken = req.uid
        const { ...campos} = req.body;
        const fechaFormateada = currentDate+' '+currentTime
        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;

        const ticketNuevo = new Tickect({
            ctiptic:campos.ctiptic,
            cnompro:campos.cnompro,
            cdesasu:campos.cdesasu,
            cdescri:campos.cdescri,
            cpriori:campos.cpriori,
            carcadj:campos.carcadj,
            cusureg:usuarioToken,
            dfecreg:fechaFormateada,
            cusumod:usuarioToken,
            dfecmod:fechaFormateada
        });

        await ticketNuevo.save();
        const types = [ 'ADM', 'ATE', '']
        for (const type of types) {  
            const notificacion = new Notificacion({
                ctiptic:campos.ctiptic,
                cnompro:campos.cnompro,
                cdesasu:campos.cdesasu,
                cdesnot:campos.cdescri,
                cestado:'se registro correctamente el ticket',
                ccatego:`${type}`,
                cusureg:usuarioToken,
                dfecreg:fechaFormateada,
                cusumod:usuarioToken,
                dfecmod:fechaFormateada
            })
            await notificacion.save();
        }



        res.status(200).json({
            ok:true,
            msg:'Se creo el ticket correctamente',
            metodo:'CONTROLERS/ticket.controler.js/crearTicket'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/crearTicket'
        }) 
    }
}


const traerListaTicketporUsuario = async(req,res=response) => {

    
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/traerListaTicketporUsuario'
        }) 
    }


    try {
        const usuarioToken = req.uid

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [tickets] = await Promise.all([
            Tickect.find({cusureg:usuarioToken})    
            .skip(desde)
            .limit(5)      
        ])


        res.status(200).json({
            ok:true,
            tickets,
            
            msg:'Se creo el ticket correctamente',
            metodo:'CONTROLERS/ticket.controler.js/traerListaTicketporUsuario'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/traerListaTicketporUsuario'
        }) 
    }
}



module.exports = {
    crearTicket,
    traerListaTicketporUsuario,
}