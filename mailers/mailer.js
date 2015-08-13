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

exports.emailConfirmation = function(req, res){

  var name = req.name.first;
    var email = req.email;
    var id = req._id
    var token = req.token;
   
    // Create a SMTP transport object
    var transport = nodemailer.createTransport("SMTP", {

            host: "smtp.mandrillapp.com", // hostname
            port: 587, // port for secure SMTP
            auth: {
                user: "app23086100@heroku.com",
                pass: "vSU7zPIQpHh4Uaizr-H5-Q"
            }

    });

    console.log('SMTP Configured');

    var link = 'http://seguimiento-renoboy.herokuapp.com/email-confirmation?i='+id+'&t='+token;


    // Message object
    var mailOptions = {

        // sender info
        from: 'Renoboy'+' <noreply@renoboy.com>',

        // Comma separated list of recipients
        to: email,

        // Subject of the message
        subject: 'Email Confirmation', //

        headers: {
            'X-Laziness-level': 1000
        },

        // HTML body
        html:'Hola '+name+', <br/>'+
           'Bienvenido al Plan de millas de Renoboy.<br/><br/><br/>'+
           '<a href='+link+'>Por favor da click aca</a> solo queremos verificar tu correo<br><br>'
    };

    console.log('Sending Mail......');

    // send mail with defined transport object
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent!");
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });
}

exports.sendOne = function (templateName, locals, fn) {
 // make sure that we have an user email
 if (!locals.email) {
   return fn(EmailAddressRequiredError);
 }
 // make sure that we have a message
 if (!locals.subject) {
   return fn(EmailAddressRequiredError);
 }
 emailTemplates(templatesDir, function (err, template) {
   if (err) {
     console.log(err);
     return fn(err);
   }
   // Send a single email
   template(templateName, locals, function (err, html, text) {
     if (err) {
       //console.log(err);
       return fn(err);
     }
     // if we are testing don't send out an email instead return
     // success and the html and txt strings for inspection
     if (process.env.NODE_ENV === 'test') {
       return fn(null, '250 2.0.0 OK 1350452502 s5sm19782310obo.10', html, text);
     }
     var transport = defaultTransport;
     transport.sendMail({
       from: config.mailer.defaultFromAddress,
       to: locals.email,
       subject: locals.subject,
       html: html,
       // generateTextFromHTML: true,
       text: text
     }, function (err, responseStatus) {
       if (err) {
         return fn(err);
       }
       return fn(null, responseStatus.message, html, text);
     });
   });
 });
}

exports.resetPassword= function(req, res){
    
    console.log(req);

    var name = req.first;
    var email = req.email;
    var id = req._id
    var token = req.reset_password_token;
   
    // Create a SMTP transport object
    var transport = nodemailer.createTransport("SMTP", {

            host: "smtp.mandrillapp.com", // hostname
            port: 587, // port for secure SMTP
            auth: {
                user: "app23086100@heroku.com",
                pass: "vSU7zPIQpHh4Uaizr-H5-Q"
            }

    });

    console.log('SMTP Configured');

    var link = 'http://seguimiento-renoboy.herokuapp.com/reset-password?i='+id+'&t='+token;
    //var link = 'http://localhost:3000/reset-password?i='+id+'&t='+token;

    // Message object
    var mailOptions = {

        // sender info
        from: 'Renoboy'+' <noreply@renoboy.com>',

        // Comma separated list of recipients
        to: email,

        // Subject of the message
        subject: 'Recuperacion de cuenta', //

        headers: {
            'X-Laziness-level': 1000
        },

        // HTML body
        html:'<img src="http://seguimiento-renoboy.herokuapp.com/img/logo.png" style="width: 190px;"> <br/>'+
             'Hola '+name+', <br/>'+
             'Para recuperar tus datos de ingreso al sistema de plan de millas de Renoboy, '+
             '<a href='+link+'>da click aqui</a><br>'+
             'Este link solo estará disponible por 3 horas.<br>'
    };

    console.log('Sending Mail......');

    // send mail with defined transport object
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent!");
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });
}

exports.welcome= function(user){
    
    var email = user.email;
    var id = user._id;
    var token = user.reset_password_token;
    
    // Create a SMTP transport object
    var transport = nodemailer.createTransport("SMTP", {

            host: "smtp.mandrillapp.com", // hostname
            port: 587, // port for secure SMTP
            auth: {
                user: "app23086100@heroku.com",
                pass: "vSU7zPIQpHh4Uaizr-H5-Q"
            }

    });

    console.log('SMTP Configured');

    var link = 'http://www.notaria20medellin.com.co/welcome?i='+id+'&t='+token;
    //var link = 'http://localhost:8000/welcome?i='+id+'&t='+token;


    // Message object
    var mailOptions = {

        // sender info
        from: 'Notaria20'+' <noreply@notaria20medellin.com>',

        // Comma separated list of recipients
        to: email,

        // Subject of the message
        subject: 'Bienvenido administrador de Notaria 20 de Medellin', //

        headers: {
            'X-Laziness-level': 1000
        },

        // HTML body
        html:'<img src="http://www.notaria20medellin.com.co/img/logos/logo.png" style="width: 190px;"> <br/>'+
             'Bienvenido a Notaria 20 de Medellin 2015, <br/>'+
             'Para iniciar su cuenta de administrador es necesario que ingrese al siguiente link , '+
             '<a href='+link+'>da click aqui</a><br>'
    };

    console.log('Sending Mail......');

    // send mail with defined transport object
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent!");
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // shut down the connection pool, no more messages
    });
}

exports.radicadoTerminado= function(radicado){
    var locals = {
        email: radicado.email,
        fecha: moment(radicado.created).tz('America/Bogota').format('YYYY/M/DD , h:mm:ss a'),
        numRadicado: radicado.numRadicado,
        acto: radicado.acto,
        observaciones: radicado.observaciones
    };

    var transport = nodemailer.createTransport("SMTP", {
      host: "smtp.mandrillapp.com", 
      port: 587, 
      auth: {
          user: config.mailer.user,
          pass: config.mailer.pass
      }
    });
    
    emailTemplates(templatesDir,locals, function(err, template){
      if (err) {
        console.log('Error1: '+err);
      } else {        
        // Send a single email
        template('respuesta', locals, function(err, html, text){
          if (err) {
            console.log('Error2: '+err);
          } else {
            // Message object
            var mailOptions = {

                // sender info
                from: 'Notaria 20 de Medellin '+' <noreply@notaria20medellin.com>',

                // Comma separated list of recipients
                to: locals.email,

                // Subject of the message
                subject: 'Número de Radicado:' + locals.numRadicado,

                headers: {
                    'X-Laziness-level': 1000
                },

                // HTML body
                html: html

            };

            console.log('Sending Mail......');

            // send mail with defined transport object
            transport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent!");
                    console.log(response.message);
                }
                transport.close(); 
            });         
          }

        });
      }
    });    
}