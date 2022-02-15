const { request,response } = require('express')
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');

const Proyecto = require('../MODELS/proyecto.model');

let currentDate = moment().format('YYYY-MM-DD')
    
let currentTime = moment().format('hh:mm:ss')

let valorFormulario = 'Proyectos'

const path = require('path')
const fs = require('fs')

const crearProyecto = async(req,res=response) => {


    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/crearVariable'
        }) 
    }


    try {

        const usuarioToken = req.uid
        const { ...campos} = req.body;
        const fechaFormateada = currentDate+' '+currentTime
        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;

        const proyectoNuevo = new Proyecto({
            cnompro:campos.cnompro,
            ccodcli:campos.ccodcli,
            cdescri:campos.cdescri,
            cusureg:usuarioToken,
            dfecreg:fechaFormateada,
            cusumod:usuarioToken,
            dfecmod:fechaFormateada,


        });
        await proyectoNuevo.save();


        res.status(200).json({
            ok:true,
            msg:'Se creo el proyecto correctamente',
            metodo:'CONTROLERS/proyecto.controler.js/crearProyecto'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/proyecto.controler.js/crearProyecto'
        }) 
    }
}


const actualizarProyecto = async(req,res=response) => {


    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/crearVariable'
        }) 
    }


    try {
        const uid = req.params.id

        const proyectoActualizar = await Proyecto.findById(uid)
        if(!proyectoActualizar){
            return         res.status(200).json({
                ok:false,
                msg:'No existe el proyecto',
                metodo:'CONTROLERS/proyecto.controler.js/actualizarProyecto'
}) 
        }
        
        const usuarioToken = req.uid
        const { ...campos} = req.body;
        

        const fechaFormateada = currentDate+' '+currentTime
        campos.cusumod = usuarioToken;
        campos.dfecmod = fechaFormateada;


        const proActualizado = await Proyecto.findByIdAndUpdate(uid,campos,{new:true})


        res.status(200).json({
            ok:true,
            proActualizado,
            msg:'Se actualizo el proyecto correctamente',
            metodo:'CONTROLERS/proyecto.controler.js/crearProyecto'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/proyecto.controler.js/crearProyecto'
        }) 
    }
}


const listadoProyectos = async(req,res=response) => {


    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/crearVariable'
        }) 
    }


    try {
        const desde = Number(req.query.inicio)|| 0 ;// manda como ?

        const [proyectos,total] = await Promise.all([
            Proyecto.find({},'cnompro ccodcli cdescri cestado')
                    .skip(desde)
                    .limit(5)
                    .populate('ccodcli','cnomusu'),
            Proyecto.countDocuments()
          
        ])



        res.status(200).json({
            ok:true,
            proyectos,
            total,
            msg:'Se ejecuto correctamente la operacion',
            metodo:'CONTROLERS/proyecto.controler.js/listadoProyectos'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/proyecto.controler.js/listadoProyectos'
        }) 
    }
}

const buscarProyecto = async(req,res=response) => {
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/buscarProyecto'
        }) 
    }
    
    try {
        const termino = req.query.termino;// manda como ?

        const regex = new RegExp(termino,'i');
        console.log(termino);
        const [proyectos] = await Promise.all([
            Proyecto.find({cnompro:regex},'cnompro ccodcli cdescri cestado')
                    .populate('ccodcli','cnomusu')          
        ])



        res.status(200).json({
            ok:true,
            proyectos,
            msg:'Se ejecuto correctamenta la operacion',
            metodo:'CONTROLERS/proyecto.controler.js/buscarProyecto'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/proyecto.controler.js/buscarProyecto'
        }) 
    }
}

const retornarPDF= (req,res ) =>{
    const pdf = req.params.data;

    const pathCompleto = path.join(__dirname,`../uploads/pdf/${pdf}`);
    console.log(pathCompleto);
    //PDF por defecto
    if(fs.existsSync(pathCompleto)){
        res.sendFile(pathCompleto);
    }else{
        const pathImg = path.join(__dirname,`../uploads/pdf/no-pdf.pdf`)
        res.sendFile(pathImg);

    }




}

module.exports = {
    crearProyecto,
    actualizarProyecto,
    listadoProyectos,
    buscarProyecto,
    retornarPDF
}