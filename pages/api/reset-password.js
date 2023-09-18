// pages/api/reset-password.js
import User from "../../models/user";
import Otp from "../../models/otp";
import { connectToDB } from "../../config/database";

export default async function handler(req, res) {
  try {
    await connectToDB();
    const { email, otp, newPassword } = req.body;

    // Find the OTP document

    const otpDocument = await Otp.findOne({ email: email, otp: otp });
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("OTP Document:", otpDocument);

    if (!otpDocument) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Check if the OTP has expired
    const now = new Date();
    if (now > otpDocument.expiresAt) {
      // OTP has expired, delete it
      await Otp.deleteOne({ _id: otpDocument._id }); // Use deleteOne method on the model
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Update the user's password
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    // Delete the OTP document
    await Otp.deleteOne({ _id: otpDocument._id }); // Use deleteOne method on the model

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
