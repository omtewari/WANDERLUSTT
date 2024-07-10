const Listing = require("../models/listing")
const Review= require("../models/reviews.js")
const {listingSchema,reviewSchema}= require("../Schema.js")
const expressError=require("../utils/expressError.js");


module.exports.reviewController=async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview)
     await newReview.save()
     await listing.save()
     req.flash("success","New Review Created!")
     res.redirect(`/listings/${listing._id}`)
     
}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove reviewId from the reviews array in Listing model
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    // Redirect back to the listing details page
    res.redirect(`/listings/${id}`);
}