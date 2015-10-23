"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// recuerda ejecutar antes grunt creadb
var db_file = "porrio.db.sqlite3";
var apuesta = require("./Apuesta.js");
var porra = require("./Porra.js");

var porras = new Object;

// Establece el IP y el puerto dependiendo del PaaS que sea
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'; 
app.set('port', (process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000));
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

app.put('/porra/:local/:visitante/:competition/:year', function( req, response ) {
	var nueva_porra = new porra.Porra(req.params.local,req.params.visitante,
					  req.params.competition, req.params.year );
	porras[nueva_porra.ID] = nueva_porra;
	response.send(nueva_porra);
});

app.put('/apuesta/:menda/:competition/:year/:local/:goles_local/:visitante/:goles_visitante', function( req, response ) {
    var esta_porra = new porra.Porra(req.params.local,req.params.visitante,
				      req.params.competition, req.params.year );
    if ( !porras[esta_porra.ID] ) {
		response.status(404).send("No existe esa porra");
    } else {
	var esta_apuesta = 
	    new apuesta.Apuesta( porras[esta_porra.ID], req.params.menda, 
				 req.params.goles_local, 
				 req.params.goles_visitante );
		response.status(200).send( esta_apuesta );
    }
    
});

app.get('/porras', function(request, response) {
	response.send( porras );
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), server_ip_address, function() {
  console.log("Node app is running at " + server_ip_address + ":" + app.get('port'));
});

// Exporta la variable para poder hacer tests
module.exports = app;
