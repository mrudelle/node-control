var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var control = require('./routes/control');
var listen = require('./routes/listen');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup the hash map that will host "slaves" by session id
app.locals.slave = {};

// serve static file from folder public at /static
app.use('/static', express.static(path.join(__dirname, 'static')));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/remote', function(req, res) {
    res.sendFile(path.join(__dirname, 'html', 'remote.html'));
});

app.get('/monitor', function(req, res) {
    res.sendFile(path.join(__dirname, 'html', 'monitor.html'));
});

//controler will send their orders here
app.use('/control', control);

//slaves will listen for orders here
app.use('/listen', listen);


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

        // also print it to the console
        console.log("Err: " + err.status + 
            "\nMsg: " + err.message + 
            "\n" + err.stack);

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


module.exports = app;
