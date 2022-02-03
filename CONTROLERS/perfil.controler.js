const moment = require('moment')
const { request,response } = require('express')


const Usuario = require('../MODELS/usuario.model');
const {validarPermisos} = require('../HELPERS/permisos.helper');

let valorFormulario = 'perfil'

let currentDate = moment().format('YYYY-MM-DD')

let currentTime = moment().format('hh:mm:ss')

const traerPerfil = async(req,res=response) =>{

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/traerPerfil'
        }) 
    }
    try {

        const valorRetorno = req.UsuarioToken

        delete valorRetorno.cpassword


        res.status(200).json({
            ok:true,
            msg:'Se ejecuto correctamente',
            usuario:valorRetorno,
            metodo:'CONTROLERS/usuario.controler.js/traerPerfil'
            
        }) 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/traerPerfil'
        }) 
    }

}

const actualizarPerfil = async(req,res=response) =>{
    
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/traerPerfil'
        }) 
    }
    try {

        res.status(200).json({
            ok:true,
            msg:'Se actualizo correctamente',
            metodo:'CONTROLERS/usuario.controler.js/traerPerfil'
            
        }) 

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/actualizarPerfil'
        }) 
    }


}

module.exports = {
    traerPerfil,
    actualizarPerfil
}