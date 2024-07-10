const express= require("express")
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema}= require("../Schema.js")
const expressError=require("../utils/expressError.js");
const Listing= require("../models/listing.js")
const {isLoggedIn, isOwner} = require("../middleware.js");
const { index, show, createNewListing, editListinga, updateListing, deleteListing, renderNewForm } = require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require("../cloudconfig.js")
const upload = multer({ storage })



const validateListing=(req,res,next)=>{
    let{error}= listingSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new expressError(errMsg,400);
    }else{
        next();

    }
}



//Index Route
router.get("/", wrapAsync(index))

//New Route
router.get("/new",isLoggedIn,renderNewForm)


//Show/Read Route
router.get("/:id", wrapAsync(show))

//Create Route
router.post("/",isLoggedIn, upload.single("listing[image][url]"), wrapAsync(createNewListing)

)

//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(editListinga))

//Update Route
router.put("/:id",isLoggedIn, isOwner, upload.single("listing[image][url]"),wrapAsync(updateListing))


// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(deleteListing));


module.exports=router;