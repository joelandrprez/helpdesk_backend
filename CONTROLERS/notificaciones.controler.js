const { request,response } = require('express')
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');

const Notificaciones = require('../MODELS/notificaciones.model');

let currentDate = moment().format('YYYY-MM-DD')
    
let currentTime = moment().format('hh:mm:ss')

let valorFormulario = 'Notificaciones'

const listaSolicitudesporUsuario = async(req,res=response) => {

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);
    console.log(valorFormulario);
    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/listaSolicitudesporUsuario'
        }) 
    }
    try {
        const desde = Number(req.query.inicio)|| 0 ;// manda como ?
        const usuarioToken = req.uid
        const [notificaciones,total] = await Promise.all([
            Notificaciones.find({cusunot:usuarioToken},'')
                    .skip(desde)
                    .limit(5)
                    .sort({dfecmod:-1}),
            Notificaciones.countDocuments({cusunot:usuarioToken})
          
        ])
        res.status(200).json({
            ok:true,
            notificaciones,
            total,
            msg:'Se actualizo el proyecto correctamente',
            metodo:'CONTROLERS/proyecto.controler.js/listaSolicitudesporUsuario'
        })  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/proyecto.controler.js/listaSolicitudesporUsuario'
        }) 

    }


}



module.exports = {
    listaSolicitudesporUsuario
}