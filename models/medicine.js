import {Schema, model, models} from 'mongoose';

const MedicineSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required!'],
    },
    image: {
        type: String,
        default: 'https://lh3.googleusercontent.com/a/AAcHTtci6RJekFINCdibq0iNLKa9rfOSIFl04lh86s2ITxUu=s96-c'
    },
    use: {
        type: String,
    },
    SideEffect: {
        type: String,
    },
    price: {
        type: Number,
    },
    Company: {
        type: String,
    },
    salt: {
        type: String,
    },
    Categories: {
        type: [String],
    },


});


const Medicine = models.Medicine || model("Medicine", MedicineSchema);

export default Medicine;



