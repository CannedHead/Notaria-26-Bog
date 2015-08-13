var moment = require('moment');
var config = require('../../config/config.json');
var radicado = require('../models/radicado');
var mailer = require('../../mailers/mailer');
var texter = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

module.exports = {
		
  createradicado: function(req, res, next){
      console.log(req.body.name);
      if(req.body.acto === undefined || req.body.acto == '') {
          console.log('missing parameter: acto'); 
          res.json(500, { message: 'acto not found'});
      }
      else if(req.body.celular === undefined || req.body.celular == '') {
          console.log('missing parameter: celular'); 
          res.json(500, { message: 'celular not found'});
      }
      else if(req.body.emailRadicado === undefined || req.body.emailRadicado == '') { 
          console.log('missing parameter: email'); 
          res.json(500, { message: 'email not found'});
      }
      else if(req.body.persona === undefined || req.body.persona == '') {
          console.log('missing parameter: persona'); 
          res.json(500, { message: 'persona not found'});
      }
      else{
        if (req.body.persona == 'natural'){
          var newradicado = new radicado({
              name: req.body.nameRadicado,
              tipoDoc: req.body.tipoDoc,
              doc: req.body.doc,
              estadoCivil: req.body.estadoCivil,
              acto: req.body.acto,
              celular: req.body.celular,
              email: req.body.emailRadicado,
              persona: req.body.persona
          });
        }
        else{
          var newradicado = new radicado({
              razon: req.body.razon,
              nit: req.body.nit,
              actividad: req.body.actividad,
              legal: req.body.legal,
              acto: req.body.acto,
              celular: req.body.celular,
              email: req.body.emailRadicado,
              persona: req.body.persona
          });            
        } 

        newradicado.save(function(err,data) {
          if(err) {
            res.json(500, {err:err}); 
            console.log('save method error!');
            console.log(err);
          } else {
            res.json(200, {radicado: data});
            console.log('post created!');
          }
        }); 
      }
  },

  updateradicado: function(req, res ,next){
    radicado.findById(req.query.id, function(err, radicado) {
          if(err){
              res.json(404,{err: err});
          }
          if (!radicado) {
              res.json(404,{err:{code: 'Consulta no encontrada'}});
          } else {

          radicado.numRadicado = req.body.numRadicado || radicado.numRadicado;
          radicado.observaciones = (req.body.observaciones||'').replace(/(?:\r\n|\r|\n)/g, ' ') || radicado.observaciones;

          radicado.save(function (err, result){
              if (err){
                res.json(500,{err:err})
              }else{
                  res.json(200,{radicado: result});
              }
          });
          }
      });
  },  

  // ENVIAR RADICADO
  enviarradicado: function(req, res, next) {
    radicado.findById(req.query.id, function(err, radicado){
      if(err){
        res.json(404,{message: "User not found"});
        return next(err);
      }
      if (!radicado) {
        res.json(404,{message: 'radicado not found'});
      } else {

        radicado.observaciones = (req.body.observaciones||'').replace(/(?:\r\n|\r|\n)/g, ' ') || radicado.observaciones;
        radicado.numRadicado = req.body.numRadicado || radicado.numRadicado; 
        radicado.activo = false;
      
        radicado.save(function (err, c){
        if (err){
          res.json(200,{err: 'Ha sucedido un error.' });
        }
        else{
          //mailer
          mailer.radicadoTerminado(c);
          // Texter
          texter.sendMessage({
              to: '+57-' + radicado.celular, // the number for the phone in your pocket
              from:'+16467590163', // your Twilio number
              body:'Estimado(a) cliente, el numero de radicado para su acto en la Notaria 20 de Medellin es ' + radicado.numRadicado, // The body of the text message
              //body:'Estimado ' + consulta.name.first + ' ' + consulta.name.last + ', El número de radicado para su consulta Premium en IURA ASESORIAS LEGALES es: ' + consulta._id,  // The body of the text message
          }, function(error, message) {
              // This callback is executed when the request completes
              if (error) {
                  console.error('Dagnabit.  We couldn\'t send the message');
                  console.log(error);
              } else {
                  console.log('MSM,SMS sent! Message id: '+message.sid);
              }
          });
          res.json(200,{radicado: radicado});
        }
      });
      }
    });
  },

  //-----------------------------------------------------------
  // READ Radicado Callback
  //-----------------------------------------------------------

  readRadicadosNaturalesCallback: function(callback) {
    radicado.find({$and: [ {}, { persona:'natural'}]},{},{}).exec(function(err, results){
      if (err) throw err;   
      // Execute callback
      callback(null,results);
    });
  },

  readRadicadosJuridicasCallback: function(callback) {
    radicado.find({$and: [ {}, { persona:'juridica'}]},{},{}).exec(function(err, results){
      if (err) throw err;   
      // Execute callback
      callback(null,results);
    });
  },

  readRadicadoByIdCallback: function(id,callback) {
    radicado.findById(id, function(err, results){
      if(err){
        callback(null,err); 
      }else{
        callback(null,results);
      }
    });        
  }, 


};