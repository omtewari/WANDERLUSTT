if(process.env.NODE_ENV  !=="production"){
    require('dotenv').config()
}



const express = require ("express")        // installing requires
const app= express();
const mongoose= require("mongoose");
const path= require("path")
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust1"
const methodOverride= require("method-override")
const ejsMate = require("ejs-mate")
const expressError=require("./utils/expressError.js");
const listings=require("./Routes/listing.js");
const reviews=require("./Routes/review.js");
const user=require("./Routes/user.js");
const session = require("express-session")
const MongoStore = require('connect-mongo');

const flash= require("connect-flash")
const passport= require("passport")
const LocalStrategy= require("passport-local")
const User =require("./models/user.js")

const ATLAS_DB=process.env.ATLAS_DB
console.log("MongoDB URI:", process.env.ATLAS_DB);
mongoose.connect(process.env.ATLAS_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process on connection failure
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


const store=MongoStore.create({
    mongoUrl: ATLAS_DB,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
}
   
)

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7* 24*60*60*1000,
        maxAge:7* 24*60*60*1000, 
        httpOnly:true,
    }
}



app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())





app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user
    next();
})


app.get('/',(req,res)=>{               // making default page
    res.send("Hi,i am OM TEWARI");
})


app.use("/listings",listings)
app.use("/listings/:id/reviews/",reviews)
app.use("/",user)




    app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page not found"));
    
})

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "Something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { message }); 
 });
     
app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});

