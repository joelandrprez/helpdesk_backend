
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const enviarCorreo = (para,titulo,texto) =>{

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'jperez021719@gmail.com',
          pass: 'ADOtata159.'
        }
      }));
      
      var mailOptions = {
        from: 'jperez021719@gmail.com',
        to: para,
        subject: titulo,
        text: texto
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });  

}

module.exports = { 
    enviarCorreo
}