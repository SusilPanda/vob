var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

require('dotenv').config();

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors());
//app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);


// Added earlier code
//Set up mongoose connection
//this code creates the default connection to the database and binds to the error event (so that errors will be printed to the console).
var mongoose = require('mongoose');
var mongoDB =  process.env.MONGO_URL_LOCAL;//'mongodb://susilpanda:website7@ds155577.mlab.com:55577/website'; // connect to our database 'mongodb://user:pass@host:port/db';
const mongoLocalUrl = 'mongodb://localhost:27017/user'
mongoose.connect(mongoLocalUrl, {
   /* auth: {
        //authdb: 'admin',
        user: 'susilpanda',
        password: 'website7'

    },*/
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var User  = require('./models/user.model.js');
var UserRequest  = require('./models/userRequest.model.js');
var VisaApplication  = require('./models/visaApplication.model.js');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//var port = process.env.PORT || 8081;        // set our port
// router.use(bodyParser.json());

var index = require('./routes/index');
var users = require('./routes/users');

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist/bridim')));

//const botBuilder = require('claudia-bot-builder');

//module.exports = botBuilder(request => `Thanks for sending ${request.text}`);
//app.use('/', index);
/*
app.use('/users', users);

// We will also add next() to indicate to our application that it should continue to the other routes.
// This is important because our application would stop at this middleware without it.
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
});

var data = {first_name : "john",
  last_name: "travolta",
  email_id : "john@gmail.com",
  password : "password",
  date_of_birth : "11-10-1980",
  is_admin : false};

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function (req, res) {
      console.log("I got a get all Request");
      User.find(function (err, users) {
        if(err)
          res.send(err);
        res.json(users);
      })
    });

// more routes for our API will happen here
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

// get a specific user by id
    .get(function (req, res) {
      console.log("I got a get Request");
      User.findById(req.params.user_id, function (err, user) {
        if(err)
          res.send(err);
        res.json(user);
      })
    })

    // update a user by its id (accessed at PUT http://localhost:8080/api/users/:user_id)
    .put(function (req, res) {
      console.log("Got a put request");
      console.log(req.body);
      //const update = updated = _.assign({ "updatedAt": new Date() }, req.body);
      User.update({_id:req.params.user_id}, req.body, function (err) {
        if (err) res.send(err);//return next(err);
        res.json({message : "User updated successfully"});
      });
      /*User.findByIdAndUpdate(req.params.user_id, req.body, function (err, user) {
          if (err) res.send(err);//return next(err);
          res.json(user);
      });*/
    })

    // delete a user by its id
    .delete(function (req, res) {
      console.log("Got a delete request");
      User.remove({_id : req.params.user_id}, function (err, user) {
        if (err)
          res.send(err);
        res.json({message: "User deleted successfully"})
      })
    });

router.route('/register')

// create a user (accessed at POST http://localhost:8080/api/register)
    .post(function(req, res){
      console.log("I got a register Request");
      console.log(req.body);

      User.create(req.body, function (err) {
        if(err){
          res.send(err);
        }
        res.json({message : "user created"});

      });
    });
// user request routes 
router.route('/userrequests')
// get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function (req, res) {
      console.log("I got a get all Request");
      UserRequest.find(function (err, userrequests) {
        if(err)
          res.send(err);
        res.json(userrequests);
      })
    });
    //

router.route('/userRequest/:enq_id')
  .get(function (req, res) {
    console.log("I got a user request get Request");
    UserRequest.findById(req.params.enq_id, function (err, userRequest) {
      if (err)
        res.send(err);
      res.json(userRequest);
    })
  });
router.route('/userRequest/save') 
  .post(function (req, res) {
    console.log("I got a user Enq Request");
    console.log(req.body);

    UserRequest.create(req.body, function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "user enq created" });

    });
  });
router.route('/uservisastatus/:passportnum')
  .get(function (req, res) {
    console.log("got a visa get request");
    VisaApplication.findOne({passport_num: req.params.passportnum}, function (err, visaApplication) {
      if (err)
        res.send(err);
      res.json(visaApplication);
    })
  });

router.route('/uservisastatus')
  .post(function (req, res) {
    console.log("got a user visa application create Request");
    console.log(req.body);

    VisaApplication.create(req.body, function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: "user visa application created" });

    });
  });
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// End of earlier code
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/
//test
module.exports = app;
var http = require('http');
var port = process.env.PORT;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
app.listen(5000, function () {
  console.log('Listening on port 5000!');
});
///server.listen(port);
//server.on('error', onError);
//server.on('listening', onListening);
