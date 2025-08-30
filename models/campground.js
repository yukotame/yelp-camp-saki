const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
        url:String,
        filename:String
    });

imagesSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload' , '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title:String,
    images:[imagesSchema],
    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
} , opts);

campgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


campgroundSchema.post('findOneAndDelete', async function (doc) {

    console.log("削除！！", doc);
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground' , campgroundSchema)