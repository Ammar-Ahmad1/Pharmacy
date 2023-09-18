// pages/api/forgot-password.js
import nodemailer from 'nodemailer';
import Otp from '@models/otp'; // Import the new OTP model
import { connectToDB } from '@config/database';
import User from '@models/user';

function generateRandomOTP() {
    // Implement this function
    
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;

}

export default async function handler(req, res) {
  try {
    await connectToDB();
    const { email } = req.body;
    console.log(email);

    // Check if the user exists
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Generate a random OTP
    const otp = generateRandomOTP(); // Implement this function

    // Save the OTP with an expiration time (e.g., 15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2); // Adjust the expiration time as needed

    const otpDocument = new Otp({ email, otp, expiresAt });
    await otpDocument.save();

    // Send the OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Reset Password OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
