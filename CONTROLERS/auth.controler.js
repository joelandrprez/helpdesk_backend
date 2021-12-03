const Usuario = require('../MODELS/usuario.model')
const TokenRecuperacion = require('../MODELS/tokenRecuperacion.model')
const ErrorLog = require('../MODELS/error.model')


const { request, response } = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../HELPERS/jwt.helper');


const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const { enviarCorreo } = require('../HELPERS/enviarcorreo.helper');
const { getMenufrontEnd } = require('../HELPERS/menu.helper');


const login = async (req = request, res = response) => {

    try {
        const { ccorusu, cpaswor } = req.body;

        const data = {}
        const usuarioExiste = await Usuario.findOne({ ccorusu });

        if(usuarioExiste.cestusu===false){
            return res.status(500).json({
                ok:false,
                msg:'El usuario esta inactivo consulte con el administrador',
                metodo:'CONTROLERS/auth.controler.js/login'
            }) 
        }

        if(usuarioExiste.nnumint === 4){
            return res.status(500).json({
                ok: false,
                msg: "La cuenta se a bloqueado por favor reestablesca la contraseña"
            })
        }

        if (!usuarioExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            })
        }
        const ValidarPassword = bcrypt.compareSync(cpaswor, usuarioExiste.cpaswor)

        if (!ValidarPassword) {

        

            const actualizarIntento = await Usuario.findByIdAndUpdate(usuarioExiste._id,{nnumint:usuarioExiste.nnumint+1});

            return res.status(400).json({
                ok: false,
                msg: "Contraseña no valida",
                intentos:actualizarIntento.nnumint
            })
        }

        const catego = usuarioExiste.ccodcat

        const token = await generarJWT(usuarioExiste._id)
        data.cnomusu =usuarioExiste.cnomusu
        data.cmail = usuarioExiste.cmail
        data.cestado =usuarioExiste.cestado

        data.img =usuarioExiste.img
        data.cnudoci = usuarioExiste.cnudoci

        const actualizarIntento = await Usuario.findByIdAndUpdate(usuarioExiste._id,{nnumint:0});
        
        res.status(200).json({
            ok: true,
            msg: 'Se logeo correctamente',
            token,
            usuario:usuarioExiste,
            menu: await getMenufrontEnd(catego),
            metodo: 'CONTROLERS/auth.controler.js/login'

        })





    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error contacte al administrador',
            metodo: 'CONTROLERS/auth.controler.js/login'
        })

    }
}

const renewToken = async (req, res = response) => {
    const uid = req.uid
    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid,'')
    const catego = usuario.ccodcat

    try {

        res.status(200).json({
            ok: true,
            msg: 'Se actualizo su token',
            token,
            usuario,
            menu:await getMenufrontEnd(catego),
            metodo: 'CONTROLERS/auth.login.js/renewToken'

        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error contacte al administrador',
            metodo: 'CONTROLERS/auth.controler.js/renewToken'
        })
    }

}

const generarTokenRecuperacion = async (req ,res = response) =>{
    try {
        const {ccorusu,url} = req.body
        const usuarioExiste = await Usuario.findOne({ccorusu})
    
        if(usuarioExiste.cestusu===false){
            return res.status(500).json({
                ok:false,
                msg:'El usuario esta inactivo consulte con el administrador',
                metodo:'CONTROLERS/auth.controler.js/generarTokenRecuperacion'
            }) 
        }
    
        const validarEnvio = await TokenRecuperacion.find({ccodusu:usuarioExiste._id,cestado:true})
        
        if(validarEnvio.length !== 0){
            return res.status(500).json({
                ok:false,
                msg:'Ya se envio un correo de reestablecimiento',
                metodo:'CONTROLERS/auth.controler.js/generarTokenRecuperacion'
            }) 
        }
    
        if(!usuarioExiste){
            return res.status(404).json({
                ok:false,
                msg:'El correo no existe',
                metodo:'CONTROLERS/auth.controler.js/generarTokenRecuperacion'
            }) 
        }
    
        const token = await generarJWT(usuarioExiste._id)
    
        const tokenR = new TokenRecuperacion({token,ccodusu:usuarioExiste._id})
        const registrarToken = await tokenR.save()
    
        const evniar = enviarCorreo(usuarioExiste.ccorusu,'APP - [Recuperar contraseña]','para Reestablece su contraseña por favor ingrese al LINK   ' + url+token)
    
    
    
          res.status(200).json({
            ok:true,
            msg:'se envio el correo correctamente',
            metodo:'CONTROLERS/auth.controler.js/generarTokenRecuperacion'
            
    
        }) 
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error contacte al administrador',
            metodo: 'CONTROLERS/auth.controler.js/generarTokenRecuperacion'
        })
        
    }

 
}

const recuparContrasena = async (req ,res = response) =>{
    try {
        const uid = req.uid;
        const {...campos} = req.body
        const salt = bcrypt.genSaltSync();
    
        if(!campos.cpaswor){

            return res.status(404).json({
                ok:false,
                msg:'No existe el parametro',
                metodo:'CONTROLERS/auth.controler.js/recuparContrasena'
                
        
            }) 

            
        }
        if(campos.cpaswor <=  6){
            return res.status(404).json({
                ok:false,
                msg:'Numero de caracteres debe ser mayor o igual a 6',
                metodo:'CONTROLERS/auth.controler.js/recuparContrasena'
                
        
            }) 
        }

        campos.cpaswor = bcrypt.hashSync(campos.cpaswor,salt);

        const validarToken= await TokenRecuperacion.findOne({ccodusu:uid,cestado:'true'});
    
        if(!validarToken){
            return res.status(404).json({
                ok:false,
                msg:'No es posible usar ese token',
                metodo:'CONTROLERS/auth.controler.js/recuparContrasena'
                
        
            }) 
        }
        else{
            
        }
    
        const matarToken =await TokenRecuperacion.findOneAndUpdate({ccodusu:uid,cestado:'true'},{cestado:'false'});
    
        const id_token = req.uid;
        const usuarioActualizado = await Usuario.findByIdAndUpdate({_id:id_token},{cpaswor:campos.cpaswor,nnumint:0})
    
        const evniar = enviarCorreo(usuarioActualizado.ccorusu,'APP - [Se a actualizado su contraseña]','Gracias por confiar en nosotros!')
    
        res.status(200).json({
            ok:true,
            id_token,
            msg:'Se reestablecio la contraseña',
            metodo:'CONTROLERS/auth.controler.js/recuparContrasena'
            
    
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se produjo un error contacte al administrador',
            metodo: 'CONTROLERS/auth.controler.js/recuparContrasena'
        })
    }

}




module.exports = {
    login,
    renewToken,
    generarTokenRecuperacion,
    recuparContrasena
}