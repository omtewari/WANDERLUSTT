const User= require("../models/user.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup=async(req,res)=>{
    try{
        let{
            username,email,password
        }=req.body;
        const newUser = new User({email,username})
         const registerdUser=await User.register(newUser,password)
       req.login(registerdUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Welcome to Wanderlust")
        res.redirect("/listings") 
       })
          
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
        }
}

module.exports.renderLoginForm= (req,res)=>{
    res.render("users/login.ejs")
    }

    module.exports.login=async(req,res)=>{
     req.flash("success","Welcome back")
     let redirecrUrl=res.locals.redirectUrl || "/listings"
     res.redirect(redirecrUrl)
          
} 

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Logged out")
        res.redirect("/listings")
    })
}