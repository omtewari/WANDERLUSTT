const Listing = require("../models/listing")
const {listingSchema,reviewSchema}= require("../Schema.js")
const expressError=require("../utils/expressError.js");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings });
}

module.exports.renderNewForm=
(req,res)=>{
    res.render("listings/new.ejs");
    }

    module.exports.show=async(req,res)=>{
        let{id}=req.params;
        const listing = await Listing.findById(id).populate({
           path:"reviews",
           populate:{path:"author"}}) 
           .populate("owner")
        console.log('Fetched listing:', listing);
        if(!listing){
           req.flash("error","Listing does not exist")
            res.redirect("/listings")
        }
        res.render("listings/show.ejs",{listing}) 
   }

   module.exports.createNewListing = async (req, res, next) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    let result1 = listingSchema.validate(req.body);
    console.log("Validation Result:", result1);
    let url = req.file.path;
    let filename = req.file.filename;
    let result = listingSchema.validate(req.body);
  
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

   module.exports.updateListing=async(req,res)=>{
  
    if(!req.body.listing){
        throw new expressError(400,"Send valid data for listing")
    }
    let{id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !=='undefined'){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    req.flash("success"," Listing Updated!")

    res.redirect(  `/listings/${id}`) 
}

module.exports.editListinga=async(req,res)=>{
    let{id}=req.params;
     const listing = await Listing.findById(id)
     let originalimage= listing.image.url;
     originalimage=originalimage.replace("/upload","/upload/w_250")
     res.render("listings/edit.ejs",{originalimage,listing})
}

module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new expressError("Listing not found", 404);
    }
    console.log("Deleted listing:", deletedListing);
    req.flash("success"," Listing Deleted!")
    // Redirect to listings page after successful deletion
    res.redirect("/listings");
}