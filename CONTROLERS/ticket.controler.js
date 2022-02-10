const { request,response } = require('express')
const bcrypt = require('bcryptjs');


const Tickect = require('../MODELS/ticket.model');
const Notificacion = require('../MODELS/notificaciones.model');
const Proyectos = require('../MODELS/proyecto.model');
const Pdf = require('../CONTROLERS/upload.controler'); 
const Usuario = require('../MODELS/usuario.model');

const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');

let currentDate = moment().format('YYYY-MM-DD')
let currentTime = moment().format('hh:mm:ss')
let valorFormulario = 'Tickets'
let valorFormulario1 = 'Asignacion de Ticket'
let valorFormulario2 = 'Tickets Asignados'

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

        const nuevoRegistro = await ticketNuevo.save();

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
            nuevoRegistro,
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

        const [tickets,nro] = await Promise.all([
            Tickect.find({cusureg:usuarioToken})    
            .skip(desde)
            .limit(5)
            .populate('cnompro','cnompro')
            .populate('cpriori','cconvar cnomvar cdesvar')
            .populate('ctiptic','cconvar cnomvar cdesvar'),
            Tickect.countDocuments({cusureg:usuarioToken})      
        ])
        res.status(200).json({
            ok:true,
            data:tickets,
            msg:'La operacion se realizo con exito',
            total:nro,
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

const AsignacionTicketAtencionCliente = async(req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/AsignacionTicketAtencionCliente'
        }) 
    }


    try {
        
        const usuarioToken = req.uid
        const uidUpdate = req.params.id;
        const campos = {}
        const { cestado,cdesasi,cdesate,cestdev } = req.body;
        console.log(cestdev);
        const fechaFormateada = currentDate+' '+currentTime
        campos.cestado = cestado
        campos.cdesasi = cdesasi
        campos.cdesate = cdesate
        campos.cestdev = cestdev
        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;
        if(campos.cestado==='registrado'){
            campos.cestdev = true
        }

        const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});

        res.status(200).json({
            ok:true,
            msg:'Se realizaron los cambios ',
            tickeactualizado,
            metodo:'CONTROLERS/ticket.controler.js/AsignacionTicketAtencionCliente'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/AsignacionTicketAtencionCliente'
        }) 
    }
}

const traerListalistaAsginacion = async(req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }


    try {
        const usuarioToken = req.uid

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [tickets,total] = await Promise.all([
            Tickect.find({cestado:'registrado'})    
            .skip(desde)
            .limit(5)
            .populate('cnompro','cnompro')
            .populate('cpriori','cconvar cnomvar cdesvar')
            .populate('ctiptic','cconvar cnomvar cdesvar'),
            Tickect.countDocuments()      
        ])


        res.status(200).json({
            ok:true,
            data:tickets,
            total,
            msg:'Se realizo la operacion con exito',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }
}


const EdicionTicketDesarrollo = async(req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario2);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/EdicionTicketDesarrollo'
        }) 
    }


    try {
        

        const usuarioToken = req.uid
        const uidUpdate = req.params.id;
        const campos = {}
        const { cestado,cdesasi,cdesdes } = req.body;
        const fechaFormateada = currentDate+' '+currentTime
        campos.cdesasi = cdesasi
        campos.cdesdes = cdesdes

        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;

        if(cestado ==='devuelto' || cestado ==='finalizado' ){

           campos.cestado = cestado
        }
        else {
            return  res.status(200).json({
                ok:true,
                msg:'Debe realizar un cambio valido',
                metodo:'CONTROLERS/ticket.controler.js/EdicionTicketDesarrollo'
            })  
        }
        const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});

        res.status(200).json({
            ok:true,
            msg:'Se realizaron los cambios',
            tickeactualizado,
            metodo:'CONTROLERS/ticket.controler.js/EdicionTicketDesarrollo'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/EdicionTicketDesarrollo'
        }) 
    }
}

const ListaTicketDesarrollo = async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario2);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }


    try {
        const usuarioToken = req.uid

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [tickets] = await Promise.all([
            Tickect.find({cdesasi:usuarioToken})    
            .skip(desde)
            .limit(5)
            .populate('cnompro','cnompro')
            .populate('cpriori','cconvar cnomvar cdesvar')
            .populate('ctiptic','cconvar cnomvar cdesvar')      
        ])


        res.status(200).json({
            ok:true,
            tickets,
            msg:'Se realizo la operacion con exito',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }
}
const traerProyectoCLiente =  async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }


    try {
        const usuarioToken = req.uid

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [proyectos] = await Promise.all([
            Proyectos.find({ccodcli:usuarioToken},'cnompro')  
        ])


        res.status(200).json({
            ok:true,
            data:proyectos,
            msg:'Se realizo la operacion con exito',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/traerListalistaAsginacion'
        }) 
    }
}

const ListaDesarroladores = async (req,res=response) =>{ 
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/ListaDesarroladores'
        }) 
    }


    try {
        const usuarioToken = req.uid;

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [desarrolladores] = await Promise.all([
            Usuario.find({ccodcat:'DES'})    
            .skip(desde)
            .limit(5)      
        ])


        res.status(200).json({
            ok:true,
            data:desarrolladores,
            msg:'Se realizo la operacion con exito',
            metodo:'CONTROLERS/ticket.controler.js/ListaDesarroladores'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/ListaDesarroladores'
        }) 
    }
}


module.exports = {
    crearTicket,
    traerListaTicketporUsuario,
    AsignacionTicketAtencionCliente,
    traerListalistaAsginacion,
    EdicionTicketDesarrollo,
    ListaTicketDesarrollo,
    traerProyectoCLiente,
    ListaDesarroladores
}