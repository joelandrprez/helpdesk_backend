const { request,response } = require('express')
const bcrypt = require('bcryptjs');


const Tickect = require('../MODELS/ticket.model');
const Notificacion = require('../MODELS/notificaciones.model');
const Proyectos = require('../MODELS/proyecto.model');
const Pdf = require('../CONTROLERS/upload.controler'); 
const Usuario = require('../MODELS/usuario.model');

const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');
const { registrarNotificaciones } = require('../HELPERS/notificacion.helper');


let currentDate = moment().format('YYYY-MM-DD')
let currentTime = moment().format('hh:mm:ss')
let valorFormulario = 'Tickets'
let valorFormulario1 = 'Asignacion de Ticket'
let valorFormulario2 = 'Tickets Asignados'

// 'Tickets'
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
        //asignar datos para la notificacion

        registrarNotificaciones('registro',nuevoRegistro)
        //FIN asignar datos para la notificacion





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
// 'Tickets' :muestra la lista de todos los Tickets registrados a los usuarios clientes
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
// 'Asignacion de Ticket' : actualiza el ticket asignando a un desarrollador
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
        const { cestado,cdesasi,cdesate,cestdev,cdiaapr } = req.body;
        console.log(cestdev);
        const fechaFormateada = currentDate+' '+currentTime
        campos.cestado = cestado
        campos.cdesasi = cdesasi
        campos.cdesate = cdesate
        campos.cestdev = cestdev
        campos.cdiaapr = cdiaapr
        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;
        campos.cateasi = usuarioToken;
        if(campos.cestado==='registrado'){
            campos.cestdev = true
        }

        const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});
        //asignar datos para la notificacion
        registrarNotificaciones('asignar',tickeactualizado)
        //fin asignar datos para la notificacion

        
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
// 'Asignacion de Ticket' : muestra la lista de todos los tickets que ya fueron asignados
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
            .populate('cusureg','cnomusu')
            .populate('ctiptic','cconvar cnomvar cdesvar')
            .populate('cateasi','cnomusu')
            .populate('cdesasi','cnomusu'),
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
//'Tickets Asignados' : actualizar el ticket a estado resuelto o pendiente por devolver
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

        if(cestado ==='pendiente por devolver' || cestado ==='resuelto' ){

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

        //asignar datos para la notificacion
        registrarNotificaciones(tickeactualizado.cestado,tickeactualizado)
        //FIN asignar datos para la notificacion



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
// 'Tickets Asignados' : muestra la lista de ticket asignado al desarrollador
const ListaTicketDesarrollo = async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario2);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/ListaTicketDesarrollo'
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
            .populate('cateasi','cnomusu')
            .populate('cdesasi','cnomusu')
                  
        ])


        res.status(200).json({
            ok:true,
            tickets,
            msg:'Se realizo la operacion con exito',
            metodo:'CONTROLERS/ticket.controler.js/ListaTicketDesarrollo'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/ListaTicketDesarrollo'
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
            Proyectos.find({ccodcli:usuarioToken,cestado:true},'cnompro')  
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
            Usuario.find({ccodcat:'DESARROLLADOR'})
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

const AnularTicketCliente = async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/AnularTicketCliente'
        }) 
    }
    try {
        const usuarioToken = req.uid
        const uidUpdate = req.params.id;
        
        const fechaFormateada = currentDate+' '+currentTime
        const validarEstadoTicket = await Tickect.findById(uidUpdate)

        const campos = { }
        campos.cestado = 'anulado',
        campos.cusumod = usuarioToken,
        campos.dfecmod = fechaFormateada

        if(validarEstadoTicket.cestado==='registrado'){
            const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});
            res.status(200).json({
            ok:true,
            msg:'Se realizaron los cambios ',
            tickeactualizado,
            metodo:'CONTROLERS/ticket.controler.js/AnularTicketCliente'
        })  
        }else{
            res.status(200).json({
                ok:false,
                msg:'No se puede modificar ese estado ',
                metodo:'CONTROLERS/ticket.controler.js/AnularTicketCliente'
            })  
        }
        

        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/AnularTicketCliente'
        }) 
    }
}
const ActualizarTicketCliente = async (req,res=response) =>{

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/AnularTicketCliente'
        }) 
    }

    try {
        const usuarioToken = req.uid
        const uidUpdate = req.params.id;
        
        const fechaFormateada = currentDate+' '+currentTime
        const validarEstadoTicket = await Tickect.findById(uidUpdate)
        
        const {...campos} = req.body

        campos.cusumod = usuarioToken,
        campos.dfecmod = fechaFormateada

        if(validarEstadoTicket.cestado==='registrado'){
            const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});
            res.status(200).json({
            ok:true,
            msg:'Se realizaron los cambios ',
            tickeactualizado,
            metodo:'CONTROLERS/ticket.controler.js/ActualizarTicketCliente'
        })  
        }else{

        }
        res.status(200).json({
            ok:false,
            msg:'No se puede modificar ese estado ',
            metodo:'CONTROLERS/ticket.controler.js/ActualizarTicketCliente'
        })  
        

        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/ActualizarTicketCliente'
        }) 
    }
}

const Busquedapordescripcion = async (req,res=response) =>{
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
        const termino = req.params.id
        const regex = new RegExp(termino,'i');
        const desde = Number(req.query.inicio)|| 0 ;// manda como ?
        console.log(termino);
        const [tickets,nro] = await Promise.all([
            Tickect.find({cusureg:usuarioToken,cdescri:regex})    
            .skip(desde)
            .limit(5)
            .populate('cnompro','cnompro')
            .populate('cpriori','cconvar cnomvar cdesvar')
            .populate('ctiptic','cconvar cnomvar cdesvar'),
            Tickect.countDocuments({cusureg:usuarioToken,cdescri:regex})      
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

const MuestraTicketGeneral = async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/MuestraTicketGeneral'
        }) 
    }
    try {
        const usuarioToken = req.uid
        const desde = Number(req.query.inicio)|| 0 ;// manda como ?
        const [tickets,nro] = await Promise.all([
            Tickect.find({cestado:{$nin:['registrado','anulado']}})    
            .skip(desde)
            .limit(5)
            .populate('cnompro','cnompro')
            .populate('cpriori','cconvar cnomvar cdesvar')
            .populate('ctiptic','cconvar cnomvar cdesvar')
            .populate('cusureg','cnomusu')
            .populate('cateasi','cnomusu ccodcat')
            .populate('cdesasi','cnomusu'),
            Tickect.countDocuments({cestado:{$ne:'registrado'}})      
        ])
        res.status(200).json({
            ok:true,
            data:tickets,
            msg:'La operacion se realizo con exito',
            total:nro,
            metodo:'CONTROLERS/ticket.controler.js/MuestraTicketGeneral'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/MuestraTicketGeneral'
        }) 
    }
}

const FinalizarTicket = async (req,res=response) =>{
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/FinalizarTicket'
        }) 
    }

    try {
        const usuarioToken = req.uid
        const uidUpdate = req.params.id;
        
        const fechaFormateada = currentDate+' '+currentTime
        const validarEstadoTicket = await Tickect.findById(uidUpdate)
        
        const campos = {}

        campos.cdesfin = req.body.cdesfin
        campos.cestado = req.body.cestado
        campos.cateasi = usuarioToken
        campos.cusumod = usuarioToken,
        campos.dfecmod = fechaFormateada
        console.log(campos);
        if(campos.cestado === 'terminado' || campos.cestado ==='devuelto'){
            if(validarEstadoTicket.cestado === 'resuelto'|| validarEstadoTicket.cestado === 'registrado' || validarEstadoTicket.cestado ==='pendiente por devolver' ){
                const tickeactualizado = await Tickect.findByIdAndUpdate(uidUpdate,campos,{new:true});
                console.log(campos);
                //asignar datos para la notificacion
                registrarNotificaciones(tickeactualizado.cestado,tickeactualizado)
                //FIN asignar datos para la notificacion
                res.status(200).json({
                ok:true,
                msg:'Se realizaron los cambios ',
                tickeactualizado,
                metodo:'CONTROLERS/ticket.controler.js/FinalizarTicket'
                })
                  
                }
        }else{
            res.status(200).json({
                ok:false,
                msg:'No se puede modificar ese estado ',
                metodo:'CONTROLERS/ticket.controler.js/FinalizarTicket'
            })  
        }



        
        

        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/ticket.controler.js/FinalizarTicket'
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
    ListaDesarroladores,
    AnularTicketCliente,
    ActualizarTicketCliente,
    Busquedapordescripcion,
    MuestraTicketGeneral,
    FinalizarTicket
}