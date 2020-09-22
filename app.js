const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const auth = require('./routes/auth')
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

let app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('DB connection closed'))
    .once('open', () => {
        const info = mongoose.connection
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });
mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    const email = req.session.userEmail;
    const firstName = req.session.firstName
    const secondName = req.session.secondName
    res.render('index', {
            user: {
                email: email,
                firstName: firstName,
                secondName: secondName
            }
        }
    );
});

app.use('/', auth);

app.get('/auth', (req, res) => {
    res.render('auth')
});


app.get('/register', (req, res) => {
    res.render('register')
});

app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});


app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: error
    });
});


app.listen(config.PORT, () =>
    console.log(`Example app listening on port ${config.PORT}!`)
);
