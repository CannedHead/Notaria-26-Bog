var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var moment = require('moment-timezone');
moment.lang('es');

var CampanaSchema   = new Schema({ 
  nombre: { type: String, required: true},
  fechaApertura: { type: Date, default: Date.now },
  fechaCierre: { type: Date, default: Date.now },
  active: {type: Boolean, default : false}
});

CampanaSchema.virtual('fechaAperturaFormat').get(function () {
   var dateWrapper = moment(this.fechaApertura).tz('America/Bogota').format('lll');
   return dateWrapper;
});

CampanaSchema.virtual('fechaCierreFormat').get(function () {
   var dateWrapper = moment(this.fechaCierre).tz('America/Bogota').format('lll');
   return dateWrapper;
});

module.exports = mongoose.model('Campana', CampanaSchema);