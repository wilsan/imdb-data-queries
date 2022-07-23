if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo');

const User = require('./models/user');
const moviesRoutes = require('./routes/movies');
const loginRoutes = require('./routes/login');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/imdb';

mongoose.connect(dbUrl)
   .then(() => {
      console.log('Database connected');
   })
   .catch(err => {
      console.log('Connection error:');
      console.log(err);
   });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Setup MongoDB session store
const store = MongoStore.create({
   mongoUrl: dbUrl,
   secret: 'secretkey',
   touchAfter: 24 * 60 * 60
});
store.on('error', err => {
   console.log('Store error!');
});

const sessionConfig = {
   store,
   name: 'imdb_session',
   secret: 'secretkey',
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
};

// Authentication
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
   res.locals.success = req.flash('success');
   next();
});

app.use('/movies', moviesRoutes);
app.use('/login', loginRoutes);

app.get('/', (req, res) => {
   res.render('home', { message: req.flash('success') });
});


app.listen(process.env.PORT || 3000, () => {
   console.log('Listening on port 3000');
});
