const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;



const listingScehma = new Schema({
    title:String,
    description:String,
    image: {
      
        url: String,
        filename: String,
      },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type: Schema.Types.ObjectId,
        ref: "Review",

      },
    ],
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User",
    }
})
      listingScehma.post("findOneAndDelete",async()=>{
          if(Listing){
            await reviews.deleteMany({_id:{$in:Listing.reviews}})
          }
        })


const Listing =mongoose.model("Listing",listingScehma)
module.exports=Listing;