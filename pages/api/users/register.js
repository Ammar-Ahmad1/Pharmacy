import { connectToDB } from "@config/database.js";
import User from "@models/user.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDB();
      console.log(req.body);
      const { name, email, password, role, phone } = req.body;
      const newUser = await User.create({
        name: name,
        email,
        password,
        phone: phone,
        role,
      });
      if (!newUser) {
        return res
          .status(500)
          .json({
            success: false,
            message: "An error occurred while adding the user",
          });
      }
      return res
        .status(201)
        .json({ success: true, message: "User added successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while adding the user",
        });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
