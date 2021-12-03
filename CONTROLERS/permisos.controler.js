const { request,response } = require('express')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const moment = require('moment')

const Permiso = require('../MODELS/permisos.model');

const crearPermiso = async(req,res=response) => {
    try {
        const { ctipcat,
                URL,
                ctitle,
                csection} = req.body;

        const permiso = new Permiso({ctipcat,URL,ctitle,csection})

        await permiso.save();

        res.status(200).json({
            ok:true,
            msg:'Se creo el permiso correctamente',
            metodo:'CONTROLERS/usuario.controler.js/crearPermiso'
        }) 

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/crearPermiso'
        }) 
    }
}

const mostrarPermisosOriginal = async(req,res=response) =>{
    try {

        const categoria = req.params.id;
        // MyModel.distinct('_id', { foo: 'bar' },
        
        const permiso = await Permiso.find({ctipcat:categoria})
        const categorias = await Permiso.distinct('csection',{ctipcat:categoria})
        const menu = []

        for (let i = 0; i < categorias.length; i++) {
            
            menu.push({titulo:categorias[i],submenu:[]})
            
            console.log(menu[i].titulo);
            for (let e = 0; e < permiso.length; e++) {

                if( categorias[i] === permiso[e].csection ){

                    menu[i].submenu.unshift({titulo:permiso[e].ctitle,url:permiso[e].URL})
                    console.log(permiso[e].URL);

                }
            }

        }
        
        res.status(200).json({
            ok:true,
            menu,
            msg:'permisos de ' + categoria,
            metodo:'CONTROLERS/usuario.controler.js/crearPermiso'
        }) 

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/mostrarPermisos'
        }) 
    }
}

const mostrarPermisos = async(req,res=response) =>{
    try {

        const categoria = req.params.id;
        // MyModel.distinct('_id', { foo: 'bar' },
        
        const permiso = await Permiso.find({ctipcat:categoria})
        const categorias = await Permiso.distinct('csection',{ctipcat:categoria})
        const menu = []

        for (let i = 0; i < categorias.length; i++) {
            
            // menu.push({titulo:categorias[i],submenu:[]})
            
            // console.log(menu[i].titulo);
            for (let e = 0; e < permiso.length; e++) {

                if( categorias[i] === permiso[e].csection ){

                    menu.push({url:permiso[e].URL})

                    console.log(permiso[e].URL);

                }
            }

        }
        
        res.status(200).json({
            ok:true,
            menu,
            msg:'permisos de ' + categoria,
            metodo:'CONTROLERS/usuario.controler.js/crearPermiso'
        }) 

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Se produjo un error contacte al administrador',
            metodo:'CONTROLERS/usuario.controler.js/mostrarPermisos'
        }) 
    }
}





module.exports = {
    crearPermiso,
    mostrarPermisos
}