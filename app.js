var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { MongoClient } = require('mongodb');
const cors = require('cors')
// const moment = require('moment')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Database Name
const dbName = 'breads';

async function main() {
  // Connection URL
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);

  // the following code examples can be pasted here...

  return db;
}

main().then((db) => {
    var indexRouter = require('./routes/index');
    var usersRouter = require('./routes/users')(db);

    var app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors())
    // app.use(moment())

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

    var debug = require('debug')('mongo-vanilla:server');
    var http = require('http');

    /**
     * Get port from environment and store in Express.
     */

    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
      var addr = server.address();
      var bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      debug('Listening on ' + bind);
    }
  }).catch((err) => {
    console.log('Failed to Connect', err);
  });

// module.exports = app;
