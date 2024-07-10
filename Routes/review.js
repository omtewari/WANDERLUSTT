const express= require("express")
const router = express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js")
const expressError=require("../utils/expressError.js");
const {listingSchema,reviewSchema}= require("../Schema.js")
const Review= require("../models/reviews.js")
const Listing= require("../models/listing.js")
const {isLoggedIn, isReviewAuthor}= require("../middleware.js");
const { reviewController, deleteReview } = require("../controllers/reviews.js");

const validateReview=(req,res,next)=>{
    let{error}= reviewSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new expressError(errMsg,400);
    }else{
        next();

    }
}

//post route
router.post("/",isLoggedIn,wrapAsync(reviewController))


//delete route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(deleteReview));

module.exports=router;