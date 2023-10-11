import { connectToDB } from "@config/database.js";
import Medicine from "@models/medicine.js";
import multer from "multer";
import cloudinary from "@config/cloudinary.js";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
const storage = multer.diskStorage({
  destination: '/tmp/uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage }).array('image', 2);
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
        
        const imageUrl = await uploadToCloudinary(req.body.image);
        const imageUrl2 = await uploadToCloudinary(req.body.image2);        
        console.log(imageUrl);
        console.log(imageUrl2);
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
          image: [imageUrl, imageUrl2],
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

        res.status(201).json({ success: true, 
          data: medicineData
         });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
const uploadToCloudinary = async (base64Image) => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const tempFilePath = join(tmpdir(), `${Date.now()}-image.jpg`);

  await writeFile(tempFilePath, buffer);

  const cloudinaryResponse = await cloudinary.uploader.upload(tempFilePath);

  await unlink(tempFilePath);

  return cloudinaryResponse.secure_url;
};

export default handler;
