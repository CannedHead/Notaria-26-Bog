var config = require('../../config/config.json');
var mysql = require('mysql');
var moment = require('moment');
moment.lang('es');

function createConnection () {
	var connection = mysql.createConnection({
	  host: config.sql.host,
	  user: config.sql.user,
	  password: config.sql.password,
	  database: config.sql.database,
	  multipleStatements: true
	});
	return connection;
};

module.exports = {

 	//-------------------------------------------------------------
 	// Registro Civil
 	//-------------------------------------------------------------


	getCivilByFolio: function(req,res){
		var connection = createConnection();
		var folio = req.query.folio;

		var query = "SELECT * FROM registro_civil WHERE folio='" + folio + "';";
		connection.query(query, function(err, rows, fields){
			if (err) {
				connection.end();
				console.log('Query: ' + query);
				console.log(err);
			 	res.json(500,{err:err});
			}
			else if(!rows[0]){
				connection.end();
				res.json(200,{success: false, msn:'No se encontraron resultados. Intentelo de nuevo.'});     				
			}
			else{
				connection.end();
				res.json(200,{success: true, registro: rows[0]});     
			}
		});

	 },
}  