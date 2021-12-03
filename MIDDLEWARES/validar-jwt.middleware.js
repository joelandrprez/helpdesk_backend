const jwt = require('jsonwebtoken')

const Usuario = require('../MODELS/usuario.model')

const ValidarJWT = (req,res,next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(404).json({
            ok:false,
            msg:'No existe token'
        })
    }

    try {
        const { uid }  = jwt.verify(token,process.env.JWT_SECRET); 
        req.uid = uid;
        next();
        
        
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