/*
 
    /api/login

*/

const { Router } = require('express');
const { check } = require('express-validator');

const { login, renewToken, recuparContrasena, generarTokenRecuperacion } = require('../CONTROLERS/auth.controler');
const { validarCampos } = require('../MIDDLEWARES/validar-campos.middleware');
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');


const router = Router();

router.post('/', [
                        check('ccorusu', 'El email debe ser valido').isEmail(),
                        check('cpaswor', 'El password debe ser valido').not().isEmpty(),
                        validarCampos
                    ], login)

router.get('/usuario/renew', [
                                    ValidarJWT
                                ], renewToken)

router.post('/generarTokenRecuperacion', [
        
                                        ], generarTokenRecuperacion);

router.post('/restaurarContrasena',[
                                    ValidarJWT], 
                                    recuparContrasena);


module.exports = router