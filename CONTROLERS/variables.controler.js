const { request,response } = require('express')
const bcrypt = require('bcryptjs');


const Variable = require('../MODELS/variables.model')
const Usuario = require('../MODELS/usuario.model')

const moment = require('moment');
const { validarPermisos } = require('../HELPERS/permisos.helper');

let currentDate = moment().format('YYYY-MM-DD')
    
let currentTime = moment().format('hh:mm:ss')

let valorFormulario = 'Variables'

let valorFormulari1 = 'Tickets'

const crearVariable = async(req,res=response) => {
    
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

        const variable = new Variable(campos)
        

        await variable.save()

        res.status(200).json({
            ok:true,
            campos,
            msg:'Se creo la variable correctamente',
            metodo:'CONTROLERS/variables.controler.js/crearVariable'
        })      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/variables.controler.js/crearVariable'
        }) 
    }
}
const actualizarVariable = async(req,res=response) => {
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/actualizarVariable'
        }) 
    }
    try {


        const fecha_registro = currentDate+' '+currentTime

        const usuario = await Usuario.findById(req.uid)
        if(usuario.ccodcat !== 'ADM'){
            res.status(400).json({
                ok:true,
                msg:'NO TIENE LOS PERMISOS PARA REALIZARLO',
                metodo:'CONTROLERS/variables.controler.js/crearVariable'
            })  
        }      



        const uidActualizar = req.params.id;
        const uidToken = req.uid;

        const {...campos} = req.body
        campos.cusumod = uidToken
        campos.dfecmod = fecha_registro



        const ExisteVariable = await Variable.findById(uidActualizar)

        if( !ExisteVariable){
            return         res.status(200).json({
                            ok:false,
                            msg:'no existe la variable',
                            metodo:'CONTROLERS/usuario.controler.js/actualizarVariable'
            }) 
        }

        delete campos.cnomvar

        const variable = await Variable.findByIdAndUpdate(uidActualizar,campos,{new:true})


        res.status(200).json({
            ok:true,
            msg:'Se actualizo la variable correctamente',
            metodo:'CONTROLERS/variables.controler.js/crearVariable'
        })  
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/variables.controler.js/actualziarVariable'
        }) 
    }
}

const traerListaVariables = async(req,res=response) => {

    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/traerListaVariables'
        }) 
    }
    try {

        const fecha_registro = currentDate+' '+currentTime

        const usuario = await Usuario.findById(req.uid)
       

          
        const uidToken = req.uid;

        const desde = Number(req.query.inicio)|| 0 ;// manda como ?
        const [variables,total] = await Promise.all([
            Variable.find({})
            .skip(desde)
            .limit(5),
            Variable.countDocuments()
        ])
        

        res.status(200).json({
            ok:true,
            variables,
            uidToken,
            total,
            msg:'Se actualizo la variable correctamente',
            metodo:'CONTROLERS/variables.controler.js/crearVariable'
        })  


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/variables.controler.js/traerListaVariables'
        }) 
    }
}

const traerPrioridad = async (req,res=response) => {
    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulari1);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/usuario.controler.js/traerPrioridad'
        }) 
    }

    try {

        const fecha_registro = currentDate+' '+currentTime

        const [prioridad,tipo] = await Promise.all([
            Variable.find({cnomvar:'cpriori'}),
            Variable.find({cnomvar:'cinctip'})
        ])
        res.status(200).json({
            ok:true,
            prioridad,
            tipo,
            msg:'la operacion se ejecuto correctamente',
            metodo:'CONTROLERS/variables.controler.js/traerPrioridad'
        })  


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/variables.controler.js/traerPrioridad'
        }) 
    }
}



module.exports = {
    crearVariable,
    actualizarVariable,
    traerListaVariables,
    traerPrioridad
    
}