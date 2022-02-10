/*
 
    /api/upload

*/


const { Router } = require('express');

const { fileUpload } = require('../CONTROLERS/upload.controler');

const ExpressfileUpload = require('express-fileupload');
const { ValidarJWT } = require('../MIDDLEWARES/validar-jwt.middleware');

const router = Router();

router.use(ExpressfileUpload());


router.put('/:id',[ValidarJWT ],fileUpload);


module.exports = router