// models/Otp.js
import { Schema, model, models } from 'mongoose';

const OtpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Otp = models.Otp || model('Otp', OtpSchema);

export default Otp;
