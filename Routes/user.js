const express= require("express")
const router = express.Router({mergeParams:true});
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const { signup, login, renderLoginForm, logout, renderSignupForm } = require("../controllers/user.js");

router.get("/signup",renderSignupForm),

router.post("/signup",wrapAsync(signup)
)

router.get(
    "/login",renderLoginForm
    
   )

        router.post(
            "/login",savedRedirectUrl,
            passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),
             wrapAsync(login)
        
        )


        router.get("/logout",logout)


module.exports=router;