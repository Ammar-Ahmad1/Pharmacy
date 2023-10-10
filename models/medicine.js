import {Schema, model, models} from 'mongoose';

const MedicineSchema = new Schema({
    id: String,
    name: String,
    slug: String,
    Company: String,
    category: String,
    Salt: String,
    Use: String,
    SideEffect: String,
    price: String,
    tags: [String],
    stock: Number,
    review: Number,
    rating: Number,
    ratingScore: Number,
    created:
    {
      type: Date,
      default: Date.now
    },
    
    image: String,
    featured: Boolean,
    trending: Boolean,
    totalSell: Number,
    discount: {
      banner: String,
      percentage: Number,
      expireDate: Date,
      isActive: Boolean,
    },
    type: String,
    strips: {
      tabletCount: Number,
      stripCountInPack: Number
    }
  });


const Medicine = models.Medicine || model("Medicine", MedicineSchema);

export default Medicine;



