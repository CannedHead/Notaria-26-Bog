'use strict';
var moment = require('moment-timezone');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'app/views/mailer');
var emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('email address required');

var defaultTransport = nodemailer.createTransport("SMTP", {

        host: "smtp.mandrillapp.com", 
        port: 587, 
        auth: {
            user: "app23086100@heroku.com",
            pass: "vSU7zPIQpHh4Uaizr-H5-Q"
        }

});

exports.contactMail = function(req, res){
  
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var message = req.body.message;
   
    // Create a SMTP transport object
    var transport = nodemailer.createTransport("SMTP",{

            host: "smtp.mandrillapp.com", // hostname
            port: 587, // port for secure SMTP
            auth: {
                user: "app23086100@heroku.com",
                pass: "vSU7zPIQpHh4Uaizr-H5-Q"
            }

    });

    console.log('SMTP Configured');

    // Message object
    var mailOptions = {

        // sender info
        from: 'Contáctenos'+' <noreply@notaria20demedellin.com>',
        // Comma separated list of recipients
        to: 'info@notaria20demedellin.com',
        // Subject of the message
        subject: 'Consulta: ' + name, //
        headers: {
            'X-Laziness-level': 1000
        },
        // HTML body
        html:'Información de la radicado: <br/>'+
           'Nombre Usuario: ' + name + '.<br/>'+
           'Teléfono: ' + phone + '.<br/>'+
           'Email: ' + email + '.<br/><br/>'+
           'Mensaje: <br/>'+ message
    };
    console.log('Sending Mail......');
    // send mail with defined transport object
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('Error: ' + error);
            res.json(500,{ message: "An error ocurred !!"});
        }else{
            console.log("Message sent!");
            res.json(200,{ message: "Success !!"});
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });  
}

