// pages/api/send-otp.js
import { Twilio } from "twilio";
import { connectToDB } from "@config/database.js";
import User from "@models/user.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  await connectToDB();
  const user = await  User.findOne({ phone: req.body.phone });
  console.log(user)
  if (user) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  const { phone } = req.body;
  console.log(phone);
  //add +92 to phone number and remove first zero
  const phone1 = "+92" + req.body.phone.slice(1);
  console.log(phone1);

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = "VA15f483fb6f007a3711f7f270313d347a";
  const twilioClient = new Twilio(accountSid, authToken);

  try {
    const verification = await twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone1, channel: "sms" });

    console.log(verification);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({ success: false });
  }
}
