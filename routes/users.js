import express from "express"
import User from "../models/user.js"
import catchAsync from "../utils/catchAsync.js"
import passport from "passport"
import { storeReturnTo } from "../middleware.js"
import users from "../controllers/users.js"

const router = express.Router();

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

router.get('/logout', users.logoutUser)

export default router;