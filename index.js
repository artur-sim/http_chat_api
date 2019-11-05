const express = require('express');
const app = express();

const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const passport = require('passport');
const passportSocketIo = require('passport.socketio');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// const sessionStore = new MongoStore({
//     url: 'mongodb://127.0.0.1:27017/chat_app'
// });
// const expressSession = session({
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     secret: 'secret',
//     cookie: {
//         originalMaxAge: null,
//         expires: 60 * 1000 * 15,
//         httpOnly: true,
//         path: "/users"
//     }
// })


// sessions
// app.use(expressSession);

// connect mongodb
mongoose.connect('mongodb://127.0.0.1:27017/chat_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((db) => {
    console.log('MongoDB Connected')
}).catch(err => {
    console.log(err)
});


// body parser

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())




// // Initialize Passport session
// app.use(passport.initialize());
// app.use(passport.session());


// let {
//     ensureAuthenticated
// } = require('./helpers/auth')

// io.use(passportSocketIo.authorize({
//     key: 'connect.sid',
//     secret: "secret",
//     store: MongoStore,
//     passport: passport,
//     cookieParser: cookieParser
// }));


// template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// serve static files
app.use(express.static('public'));

let user = require('./routes/user')
let messages = require('./routes/messages');



// global vars

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// load models

app.get('', (req, res) => {

    res.render('chatroom')

})

require('./helpers/sockets')(io);

// io.on('connection', function (socket) {
//     console.log('Connected')
//     // example 'event1', with an object. Could be triggered by socket.io from the front end
//     socket.on('event1', function (eventData) {
//         // user data from the socket.io passport middleware
//         if (socket.request.user && socket.request.user.logged_in) {
//             console.log(socket.request.user);
//         }
//     });
// });


app.use('/users', user);
app.use('/messages', messages);

let PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
    console.log('Server Started')
});