const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingScehma = new Schema({
    title:String,
    description:String,
    image: {
        filename: {
          type: String,
          default: 'default_image'
        },
        url: {
          type: String,
          default: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          set: (v) => 
            v === "" ? 
              "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              : v
        }
      },
    price:Number,
    location:String,
    country:String,
})

const Listing =mongoose.model("Listing",listingScehma)
module.exports=Listing;