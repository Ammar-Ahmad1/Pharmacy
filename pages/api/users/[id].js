// import User from "../../../models/user";
// import { connectToDB } from "../../../config/database";

// export default async function handler(req,{ params }) {
//     if (req.method === "GET") {
//         try {
//             await connectToDB();
//             const user = await User.find({ _id: params.id });
//             console.log(user);
//             if (!user) {
//                 return new Response(404).json({ success: false, message: "User not found" });
//             }
//             return new Response(200).json({ success: true, data: user });
//         } catch (error) {
//             return new Response(500).json({ success: false, message: "Failed to get user" });
//         }
//     } else if (req.method === "PATCH") {
//         try {
//             await connectToDB();
//             const { name, email, dateOfBirth, image } = req.body;
//             const existingUser = await User.findById(params.id);
//             if (!existingUser) {
//                 return res
//                     .status(404)
//                     .json({ success: false, message: "User not found" });
//             }
//             existingUser.name = name;
//             existingUser.email = email;
//             existingUser.dateOfBirth = dateOfBirth;
//             existingUser.image = image;
//             await existingUser.save();
//             return res
//                 .status(200)
//                 .json({ success: true, message: "User updated successfully" });
//         } catch (error) {
//             return res
//                 .status(500)
//                 .json({ success: false, message: "Failed to update user" });
//         }
//     } else {
//         return res
//             .status(405)
//             .json({ success: false, message: "Method not allowed" });
//     }
// }
// import User from "../../../models/user";
import User from "@models/user.js"
import {connectToDB} from '@config/database.js'
// import { connectToDB } from "../../../config/database";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await connectToDB();
            const user = await User.findById(req.query.id);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to get user" });
        }
    } else if (req.method === "PATCH") {
        try {
            await connectToDB();
            const { name, email, dateOfBirth, image } = req.body;
            const existingUser = await User.findById(req.query.id);

            if (!existingUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            existingUser.name = name;
            existingUser.email = email;
            existingUser.dateOfBirth = dateOfBirth;
            existingUser.image = image;
            await existingUser.save();

            return res.status(200).json({ success: true, message: "User updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to update user" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
