import dotenv from 'dotenv';
if(process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from "express";
import mongoose from "mongoose"
import engine from "ejs-mate";
import methodOverride from "method-override";
import ExpressError from "./utils/ExpressError.js";
import { fileURLToPath } from 'url'; 
import { dirname, join } from 'path';
import users from "./routes/users.js"
import whiskies from "./routes/whisky.js"
import reviews from "./routes/reviews.js"
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local"
import User from './models/user.js'
import { setCurrentUser } from "./middleware.js";
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet, { contentSecurityPolicy } from 'helmet';

const dbUrl = process.env.DB_URL;

const app = express();

const sessionConfig = {
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.set('view engine', 'ejs')

app.engine('ejs', engine)

app.use(methodOverride('_method'))
const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'views')));
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(flash())


//app.use(ExpressMongoSanitize())
//app.use(helmet())

// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
//     "https://cdn.jsdelivr.net",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://images.unsplash.com",
//                 "https://img.thewhiskyexchange.com",
//                 "https://www.ardbeg.com/",
//                 "https://www.whiskyshop.com/",
//                 "https://therarewhiskeyshop.com/",
//                 "https://www.redbreastwhiskey.com/",
//                 "https://www.masterofmalt.com/",
//                 "https://www.vintageliquorkenya.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


app.use(session(sessionConfig))
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error');
    next();
})

app.use(setCurrentUser)

mongoose.connect('mongodb://localhost:27017/whisky');

const db =  mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!")
})

app.use('/whiskies/:id/reviews', reviews)
app.use('/whiskies', whiskies)
app.use('/', users)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render('error', {err})
})


app.listen(9000, () => {
    console.log("Listening on port 9000...") 
})