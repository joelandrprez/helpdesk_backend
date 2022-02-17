/*
npm install express /para levantar el servidor
npm install dotenv  / variables de entornos
npm install cors    / control de quienes pueden acceder a mi backend
npm install express-validator / middleswares para validar los campos que recibimos
npm install mongoose --save / ODM para laa base
npm install bcryptjs  / es nesesario para Hashear la contraseña
npm install jsonwebtoken / generacion de jwt
npm install uuid /generar el nombre aleatorio
npm i express-fileupload / para subir imagenes
npm npm install --save-dev nodemon
*/


const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors')
const app = express();
const {dbConnection} = require('./DB/config')

//limita el acceso 
app.use(cors());

app.options('*',cors())
//parse a JSON
app.use(express.static(path.join(__dirname, 'public/index.html')));
app.use(express.json());


//coneccion a laa base mongo
dbConnection();



app.use('/api/usuarios',require('./ROUTES/usuario.route'));

app.use('/api/login',require('./ROUTES/auth.route'));

app.use('/api/permisos',require('./ROUTES/permisos.route'));

app.use('/api/variable',require('./ROUTES/variable.route'));

app.use('/api/perfil',require('./ROUTES/perfil.route'));

app.use('/api/proyecto',require('./ROUTES/proyecto.route'));

app.use('/api/ticket',require('./ROUTES/ticket.route'));

app.use('/api/notificaciones',require('./ROUTES/notificaciones.route'));

app.use('/api/upload',require('./ROUTES/upload.route'));


app.listen(process.env.PORT,()=>{
    console.log('SERVIDO ON');
})
