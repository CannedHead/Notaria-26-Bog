var civilController = require('../app/controllers/civilController');
var radicadoController = require('../app/controllers/radicadoController');
var userController = require('../app/controllers/userController');
var mailer = require('../mailers/mailer');

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
};

// -----------------------------------------------------------------

function ensureAdmin(req, res, next) {
	if (req.isAuthenticated()) {
    	if (req.user.hasRole('admin')) {
      		return next();
    	} else {
    		return res.redirect('/');
    	}
 	} 	
};

// -----------------------------------------------------------------

function ensureCliente(req, res, next) {

 	if (req.isAuthenticated()) {
    	if (req.user.hasRole('renoboy') || req.user.hasRole('admin')) {
      		return next();
    	} else{
    		return res.redirect('/');
    	}
 	}
};

// -----------------------------------------------------------------

module.exports = function(router, passport) {

	// -----------------------------------------------------------------
	// -----------------------------------------------------------------
	// API
	// -----------------------------------------------------------------
	// -----------------------------------------------------------------
	
	router.route('/api/mailer')
		.post(mailer.contactMail);

	router.route('/api/consultarCivil')
		.get(civilController.getCivilByFolio);

	// radicado
	router.route('/api/radicados')
		.post(radicadoController.createradicado);

	router.route('/api/naturales')
		.get(function(req,res){ 
			radicadoController.readRadicadosNaturalesCallback(function(err,results){
			    if(err){
			      res.json(200,{success: false, err: {code: 'Se ha presentado un error!'}}); 
			    }
			    else{
			      res.json(200,{success: true, radicados: results});
			    }	      
			});
		});

	router.route('/api/juridicas')
		.get(function(req,res){ 
			radicadoController.readRadicadosJuridicasCallback(function(err,results){
			    if(err){
			      res.json(200,{success: false, err: {code: 'Se ha presentado un error!'}}); 
			    }
			    else{
			      res.json(200,{success: true, radicados: results});
			    }	      
			});
		});


	// -----------------------------------------------------------------
	// -----------------------------------------------------------------
	// home
	// -----------------------------------------------------------------
	// -----------------------------------------------------------------

	router.route('/')
		.get(function(req, res) {
			res.render('index');   
		});

	// -----------------------------------------------------------------
	// -----------------------------------------------------------------
	// Admin
	// -----------------------------------------------------------------
	// -----------------------------------------------------------------

	router.route('/admin')
		.get(function(req, res) {
			res.render('login', {
				logged: req.isAuthenticated(),
				user : req.user,
				success: null,
				error: null,
				flash: null 
			});   
		});

	router.route('/invite')
		.get(userController.inviteUser);

	router.route('/naturales')
		.get(function(req, res) {
			radicadoController.readRadicadosNaturalesCallback(function(err,radicados){
				res.render('admin/naturales',{
					logged: req.isAuthenticated(),
					user : req.user,
					radicados: radicados
				}); 
			});
		});

	router.route('/juridicas')
		.get(function(req, res) {
			radicadoController.readRadicadosJuridicasCallback(function(err,radicados){
				res.render('admin/juridicas',{
					logged: req.isAuthenticated(),	
					user : req.user,
					radicados: radicados
				}); 
			});
		});

	router.route('/editar')
		.get(function(req, res) {
			radicadoController.readRadicadoByIdCallback(req.query.id, function(err,result){
				res.render('admin/editar',{
					logged: req.isAuthenticated(),
					user : req.user,
					radicado: result
				}); 
			});
		})
		.put(radicadoController.updateradicado)
		.post(radicadoController.enviarradicado);


	// -----------------------------------------------------------------
	// -----------------------------------------------------------------
	// Authentication
	// -----------------------------------------------------------------
	// -----------------------------------------------------------------

	router.route('/login')
		.get(function(req,res){
			res.redirect('/admin'); 
		})
		.post(passport.authenticate('local', { successRedirect: '/naturales',
	                                   		   failureRedirect: '/failed-login'}));

	// -----------------------------------------------------------------

	router.route('/logout')
		.get(function(req, res) {
			req.logout();
	        res.redirect('/'); 
		});

	// -----------------------------------------------------------------

	router.route('/welcome')
		.get(userController.showSetPasswordWelcome)

	// -----------------------------------------------------------------

	router.route('/reset-password')
		.get(userController.showResetPassword)
		.post(userController.resetPassword);

	// -----------------------------------------------------------------

	router.route('/change-password')
		.post(userController.changePassword);

	// -----------------------------------------------------------------
	router.route('/update-password')
		.post(userController.updatePassword);

	// -----------------------------------------------------------------

	router.route('/failed-login')
		.get(function(req, res) {
				res.render('login', {error: 'Usuario o contraseña invalidos.', success:null, flash:null});	    
		});

};
