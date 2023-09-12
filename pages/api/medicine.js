import { connectToDB } from "@config/database.js";
import Medicine from "@models/medicine.js";
import multer from "multer";
import cloudinary from "@config/cloudinary.js";
import { writeFile, unlink } from "fs/promises";
const upload = multer({ dest: "uploads/" });
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
        const file = req.body.image;
        const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const tempFilePath = "/uploads"; // Update this path
        await writeFile(tempFilePath, buffer);

        const cloudinaryResponse = await cloudinary.uploader.upload(
          tempFilePath
        );
        // // // // Access public URL of the uploaded image
        const imageUrl = cloudinaryResponse.secure_url;
        const medicineData = await Medicine.create({
          name: req.body.name,
          slug: req.body.slug,
          Company: req.body.Company,
          category: req.body.category,
          Salt: req.body.Salt,
          Use: req.body.Use,
          SideEffect: req.body.SideEffect,
          price: req.body.price,
          // tags: req.body.tags,
          stock: req.body.stock,
          review: req.body.review,
          rating: req.body.rating,
          ratingScore: req.body.ratingScore,
          created: req.body.created,
          image: imageUrl,
          featured: req.body.featured,
          trending: req.body.trending,
          totalSell: req.body.totalSell,
          type: req.body.type,
          discount: req.body.discount,
          strips: {
            tabletCount: req.body.strips.tabletCount,
            stripCountInPack: req.body.strips.stripCountInPack,
          },
        });

        await unlink(tempFilePath);
        res.status(201).json({ success: true, data: medicineData });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body; // Assuming you send the medicine ID in the request body

        if (!id) {
          return res
            .status(400)
            .json({ success: false, message: "Medicine ID is missing." });
        }

        // Use Mongoose to find and delete the medicine by ID
        const deletedMedicine = await Medicine.findByIdAndDelete(id);

        if (!deletedMedicine) {
          return res
            .status(404)
            .json({ success: false, message: "Medicine not found." });
        }

        res.status(200).json({ success: true, data: deletedMedicine });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
