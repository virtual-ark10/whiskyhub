import Whisky from "../models/whisky.js";
import User from "../models/user.js";

export const renderRegister = (req, res) => {
    res.render('auth/register')
}

export const registerUser = async(req, res)=> {
    try {
        const {username, email, password} = req.body;
        const user = new User ({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to Whisky, ${user.username}`);
            res.redirect('/whiskies')
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')

    }
}

export const renderLogin = (req, res) => {
    res.render('auth/login')
}

export const loginUser = (req, res) => {
    const currentUser = req.user;
    //console.log("Hello "+ currentUser.username);
    const redirectUrl = req.session.returnTo || '/whiskies'
    delete req.session.returnTo;
    req.flash('success', `Welcome Back, ${currentUser ? currentUser.username : 'Guest'}!`);
    res.redirect(redirectUrl);
}

export const logoutUser = (req, res) => {
    req.logout( function(err) {
        if(err) {
            return next (err)
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login')
    })
}


export default {renderRegister, registerUser, renderLogin, loginUser, logoutUser}