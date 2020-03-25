const express =require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//Initialiazation
const app = express();
require('./database');
require('./config/passport');
//Settings
app.set('port',process.env.PORT || 3000);
//localizar la carpeta views
app.set('views', path.join(__dirname, 'views'));
//crear template
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');
//Middlewares
//desencriptar codigo
app.use(express.urlencoded({
    extended: false
}));

//peticiones de formulario
app.use(methodOverride('_method'));
//crear sesiones
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
//verify user autenthication before view will be execute
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
//local varaibles to show to other pages
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static files
app.use (express.static(path.join(__dirname, 'public')));

//Server is listenning
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});