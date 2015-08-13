var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
 
var radicadoSchema = new Schema({
  // fechas
  created: { type: Date, default: Date.now },
  ended: { type: Date},  

  // natural
  name: { type: String},
  tipoDoc: { type: String},
  doc: { type: String},
  estadoCivil: { type: String},

  // juridica
  razon: { type: String},
  nit: { type: String},
  actividad: { type: String},
  legal: { type: String},    

  // general
  acto: { type: String, required: true},
  celular: { type: String, required: true},
  email: { type: String, required: true},
  observaciones: { type: String},
  numRadicado: { type: String},
  
  // estado
  persona: { type: String, required: true},
  activo: {type: Boolean, default: true}
});

// -----------------------------------------------------------------
// Virtuals
// -----------------------------------------------------------------

radicadoSchema.virtual('fechainformat').get(function () {
   var dateWrapper = moment(this.created).format('MMMM DD, YYYY h:mm a');
   return dateWrapper;
});

// Export user model
module.exports = mongoose.model('radicado', radicadoSchema);


