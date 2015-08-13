// -----------------------------------------------------------------
// Require modules
// -----------------------------------------------------------------
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session      = require('express-session'),
    bodyParser = require('body-parser'),
    morgan         = require('morgan'),
    methodOverride = require('method-override');

var app = express();

var http = require('http')
    server = http.createServer(app);


//Load config files
var config = require(__dirname + '/config/config.json');

// -----------------------------------------------------------------
// Configure Expresss
// -----------------------------------------------------------------

app.use(cookieParser()); 
app.use(session({
	secret: config.cookie_secret,
	// Set session to expire after 21 days
    cookie: { maxAge: new Date(Date.now() + 181440000)},cookie: { maxAge: 2628000000 },
	// Set up MongoDB session storage
    //store: new mongoStore({url:config.db.test}),

	
})); //si
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(morgan('dev')); 
app.use(bodyParser());
app.use(methodOverride()); 
app.use(express.static(__dirname + '/public'));


app.locals.moment = require('moment');

// -----------------------------------------------------------------
// Routes
// -----------------------------------------------------------------

var router = express.Router(); 
require('./config/routes')(router);
app.use(router);

// -----------------------------------------------------------------
// Start app
// -----------------------------------------------------------------

server.listen(app.get('port'), function(){
  console.log("Listening on port " + app.get('port'));
});


