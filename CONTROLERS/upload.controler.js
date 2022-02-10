const { response } = require("express");
const { v4 : uuidv4 } = require ('uuid');
const fs = require('fs')
const { validarPermisos } = require('../HELPERS/permisos.helper');
const Tickect = require('../MODELS/ticket.model');

const path = require('path')
let valorFormulario = 'Tickets'


const fileUpload = async ( req , res =response ) =>{



    const per = await validarPermisos(req.UsuarioToken.ccodcat,valorFormulario);

    if(per===false){
        return res.status(200).json({
            ok:true,
            msg:'No tiene permiso para realizar la operacion',
            metodo:'CONTROLERS/ticket.controler.js/crearTicket'
        }) 
    }

    const id  =req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            msg:'no se selecciono el archivo'
        });
      }

    const file =  req.files.pdf;

    const nombreCortado = file.name.split('.');

    const extension = nombreCortado[nombreCortado.length-1];

    //validar extension

    const extensionValida = ['pdf']

    if(!extensionValida.includes(extension)){
        return res.status(400).json({
            ok:false,
            msg:'no es una extencion valida'
        })

    }
    //generar el nombre del archivo
    
    const nombreArchivo = `${uuidv4()}.${extension}`;

    const pathViejo = await Tickect.findById(id)

    borrarImagen(pathViejo.carcadj)
    console.log(pathViejo.carcadj);

    const pathac = await Tickect.findByIdAndUpdate(id,{carcadj:nombreArchivo},{new:true})
    //crear el path
    
    const path = `./uploads/pdf/${nombreArchivo}`

    file.mv(path, (err) => {
        if (err){
            return res.status(500).json({
                ok:false,
                msg:'error al subir el archivo'
            });

        }
    //actualizar imagen
    
        res.status(200).json({
            ok:true,
            pathac,
            msg:'se subio',
            nombreArchivo
        })
      });



}
const borrarImagen = (path)=> {
    pathViejo = `./uploads/pdf/${path}`;
    if(fs.existsSync(pathViejo)){//si existe lo elimina
        fs.unlinkSync(pathViejo)
    }
}


module.exports={
    fileUpload,
    borrarImagen
}