import Medicine from "../../models/medicine"; // Adjust the path accordingly
import { connectToDB } from "../../config/database";

const handler = async (req, res) => {
    const { method } = req;

    await connectToDB();

    switch (method) {
        case "GET":
            try {
                const medicines = await Medicine.find({});

                res.status(200).json({ success: true, data: medicines });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case "POST":
            try {
                const { name, image, use, SideEffect, price, Company, salt, Categories } = await request.json();
                const medicine = await Medicine.create({
                    name,
                    image,
                    use,
                    SideEffect,
                    price,
                    Company,
                    salt,
                    Categories
                });
                res.status(201).json({ success: true, data: medicine });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}

export default handler;