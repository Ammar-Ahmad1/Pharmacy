import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  name: {
    type: String,
    required: [true, 'name is required!'],
  },
  image: {
    type: String,
    default: 'https://lh3.googleusercontent.com/a/AAcHTtci6RJekFINCdibq0iNLKa9rfOSIFl04lh86s2ITxUu=s96-c'
  },
  password: {
    type: String,
  },
  role: {
    type: String,

  },
  phone: {
    //type is mobile number ie 11 digits
    type: String,
  },
  address: {
    type: String,

  },



});

const User = models.User || model("User", UserSchema);

export default User;