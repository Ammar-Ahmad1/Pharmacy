// pages/api/verify-otp.js
import { Twilio } from "twilio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { phone, code } = req.body;
  const phone1 = "+92" + req.body.phone.slice(1);
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = "VA6737b7638930fe25163401a29df0267e";

  const twilioClient = new Twilio(accountSid, authToken);

  try {
    const verificationCheck = await twilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone1, code: code });

    if (verificationCheck.status === "approved") {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error("Twilio verification error:", error);
    res.status(500).json({ success: false });
  }
}
