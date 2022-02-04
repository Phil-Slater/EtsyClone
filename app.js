const express = require('express');
const mustacheExpress = require('mustache-express');
const logger = require('morgan');

const path = require("path");
const debug = require('debug')('etsyclone:server');
const http = require('http');
const port = process.env.PORT || '3000';
const app = express();

const session = require('express-session')
app.use(session({
    secret: 'tacocat',
    saveUninitialized: true,
    resave: true
}))

const indexRoute = require('./routes/index.js');
const loginRoute = require('./routes/login.js');
const dashboardRoute = require('./routes/dashboard.js')

app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", require('./routes/index.js'));
app.use("/login", require('./routes/login.js'));
app.use("/cart", require('./routes/cart.js'));
app.use("/product", require('./routes/product.js'));
app.use("/login", require('./routes/login.js'));
app.use("/dashboard", dashboardRoute);

// error handler
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
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

// console server logging
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}