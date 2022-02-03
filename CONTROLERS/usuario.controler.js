
const { request,response } = require('express')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment')

const Usuario = require('../MODELS/usuario.model');
const { generarJWT } = require('../HELPERS/jwt.helper');

const {validarPermisos} = require('../HELPERS/permisos.helper');

let valorFormulario = 'usuarios'

const crearUsuario = async(req,res=response) =>{



    let currentDate = moment().format('YYYY-MM-DD')

    let currentTime = moment().format('hh:mm:ss')

    

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/crearUsuarios'
        }) 
    }

    try {
        
        
        const { ccorusu,
                cnudoci,
                cnomusu,
                capeusu,
                cpaswor,
                cestusu,
                ccodcat,
                nnumint,
                cdirusu,
                csexusu,
                dfecnac
                } = req.body;


        const fecha_registro = currentDate+' '+currentTime
        const existeUsuario = await Usuario.findOne({ccorusu});

        if( existeUsuario ){
            return         res.status(200).json({
                            ok:false,
                            msg:'El correo ya esta registrado',
                            metodo:'CONTROLERS/usuario.controler.js/crearUsuario'
            }) 
        }        
      
        const usuarioNuevo = new Usuario({  
                                ccorusu:ccorusu,
                                cnudoci:cnudoci,
                                cnomusu:cnomusu,
                                capeusu:capeusu,
                                cpaswor:cpaswor,
                                cestusu:cestusu,
                                ccodcat:ccodcat,
                                nnumint:nnumint,
                                cdirusu:cdirusu,
                                csexusu:csexusu,
                                dfecnac:dfecnac,
                                cusureg:'615a04c69d2b43abf1fc9ef8',
                                dfecreg:fecha_registro,
                                cusumod:'615a04c69d2b43abf1fc9ef8',
                                dfecmod:fecha_registro,

                                })       

         
        const salt = bcrypt.genSaltSync();

        usuarioNuevo.cpaswor = bcrypt.hashSync(cpaswor,salt);

        const token = await generarJWT(usuarioNuevo.uid)

        await usuarioNuevo.save();

        res.status(200).json({
            ok:true,
            msg:'Se creo el usuario correctamente',
            obj:usuarioNuevo,
            per,
            token,
            metodo:'CONTROLERS/usuario.controler.js/crearUsuarios'
        }) 
        
  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/createUsuarios'
        }) 
    }

}

const actualizarUsuario = async(req,res=response) =>{

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/actualizarUsuario'
        }) 
    }

    try {

        let currentDate = moment().format('YYYY-MM-DD')
    
        let currentTime = moment().format('hh:mm:ss')

        const uid = req.params.id;
        const id_token = req.uid;

        console.log('id por url',uid);
        console.log('id por token ',id_token);

        // validacion si el usuario del token es el mismo que el que desea actualizar su perfil

        const usuarioPeticio = await Usuario.findById(id_token);
        console.log(usuarioPeticio);
        if( uid === id_token || usuarioPeticio.ccodcat === 'ADM' ){
            
        }
        else{
            return res.status(400).json({
                ok:false,
                msg:'no tiene permiso para realizar la operacion',
                metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
            })
        }
        // FIN validacion si el usuario del token es el mismo que el que desea actualizar su perfil

        const { 
                ccorusu,...campos} = req.body;
                
        const fecha_actualizacion = currentDate+' '+currentTime;
        if(mongoose.isValidObjectId(uid)){


            const usuarioExiste = await Usuario.findById(uid);

            if(!usuarioExiste){
                return res.status(404).json({
                    ok:false,
                    msg:'No se encontro el usuario',
                    metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
                })
            }

            if(usuarioExiste.ccorusu !== ccorusu){

                const emailExiste = await Usuario.findOne({ccorusu});

                if( emailExiste ){
                return res.status(400).json({
                    ok:false,
                    msg:'el correo ya esta registrado',
                    metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
                })
                }

            }

            const salt = bcrypt.genSaltSync();

            if(campos.cpaswor){
                campos.cpaswor = bcrypt.hashSync(campos.cpaswor,salt);

            }else{
                delete campos.cpaswor
            }
                                    
            campos.dfecmod = fecha_actualizacion
            campos.ccorusu = ccorusu

            const usuarioActualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true})


            res.status(200).json({
                ok:true,
                msg:'Se actualizo el usuarios correctamente',
                usuarioActualizado,
                metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
                

            }) 
        }
        else{
            return  res.status(500).json({
                    ok:false,
                    msg:'No es un Objeto valido',
                    metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
            }) 
        }
    } catch (error) {
        return  res.status(500).json({
            ok:false,
            msg:'No es un Objeto valido',
            metodo:'CONTROLERS/usuario.controler.js/updateUsuarios'
            }) 
    }

}


module.exports = {
    crearUsuario,
    actualizarUsuario
}