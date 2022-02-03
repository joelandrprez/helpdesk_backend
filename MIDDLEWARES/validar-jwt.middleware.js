const jwt = require('jsonwebtoken')

const Usuario = require('../MODELS/usuario.model')

const Variable = require('../MODELS/variables.model');

const ValidarJWT = async (req,res,next)=>{

    const token = req.header('x-token');

    const variable =  await Variable.findOne({cnomvar:'cestsis'})

    if(!token){
        return res.status(404).json({
            ok:false,
            msg:'No existe token'
        })
    }

    try {

        
        const { uid }  = jwt.verify(token,process.env.JWT_SECRET); 
        req.uid = uid;
        

        const catego = await Usuario.findById(uid)



        if(variable.cconvar === 'true' ){
            req.UsuarioToken = catego
            next();

        }
        else {
            if(catego.ccodcat === 'ADM'){
                req.UsuarioToken = catego
                next();

            }else{
                console.log(__dirname);
                res.status(500).json({
                    ok:false,
                    msg:'El sistema esta deshabilitado',
                    metodo:'MIDDLEWARES/validar-jwt-middleware/ValidarJWT'
                }) 
            }

            
        }


        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Expiro el token',
            metodo:'MIDDLEWARES/validar-jwt-middleware/ValidarJWT'
        }) 
    }


}

module.exports = {
    ValidarJWT
}