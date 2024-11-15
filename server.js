const express = require("express");
const app = express();
var http = require("http").createServer(app);
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const errorHandler = require('./app/middleware/error');
const connectDB = require('./app/db/mongoose');
const googleAuth =require('./app/helper/passport');
const passport = require('passport');
const cookieSession = require('cookie-session');
const routes = require('./route');
const methodOverride = require('method-override');
const consumer = require('./app/redis/consumer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
//intializing cors
app.use(cors({ credentials: true }));
app.use(methodOverride('_method'));

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

//load env variables
const PORT = process.env.PORT || 6600;

//loading database
connectDB();

//loading googleAuth
googleAuth();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

routes.map(route => {
    app.use(route.path, route.handler);
});

//our errorHandler middleware(it is after brands route becuase node executes in linear order)
app.use(errorHandler);

server = http.listen(PORT, console.log(`Server is up and running at port number ${PORT} , Mode=${process.env.NODE_ENV}`));