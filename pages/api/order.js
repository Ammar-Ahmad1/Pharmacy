import { connectToDB } from "@config/database.js";
import Order from "@models/order.js";
import Medicine from "@models/medicine.js";
import OrderCounter from "@models/orderCounter.js";
import { ObjectId } from "mongodb";

async function generateOrderNumber() {
  await connectToDB();
  // Fetch the current counter value from the database
  let counter = await OrderCounter.findOne();
  if (!counter) {
    counter = new OrderCounter();
  }

  // Increment the counter and save it back to the database
  counter.counter++;
  await counter.save();

  // Generate the order number using the counter value
  const orderNumber = `ABC${counter.counter.toString().padStart(4, "0")}`;

  return orderNumber;
}
export default async function handler(req, res) {
  const { method, query } = req;

  // Connect to the database
  await connectToDB();

  switch (method) {
    case "GET":
      try {
        // Check if a user ID query parameter is provided
        if (query.userId) {
          // Retrieve orders for the specific user
          const orders = await Order.find({ user: query.userId })
            .populate("user") // Populate the 'user' field
            .populate("items.medicine"); // Populate the 'items' field, including the 'medicine' reference
          res.status(200).json({ success: true, data: orders });
        } else {
          // If no user ID is provided, return all orders
          const orders = await Order.find({})
            .populate("user") // Populate the 'user' field
            .populate("items.medicine"); // Populate the 'items' field, including the 'medicine' reference
          res.status(200).json({ success: true, data: orders });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
      }
      break;
    case "POST":
      try {
        // Create a new order
        // console.log(req.body);
        // Calculate profit from each item in order and add it to the order
        let profit = 0;
        for (const item of req.body.items) {
          // Await the Medicine.findOne call to get the medicine object
          const medicine = await Medicine.findOne({ _id: item.medicine });
          console.log(medicine);

          if (medicine) {
            // Ensure that the medicine object exists before calculating profit
            profit += medicine.price * 0.14 * item.quantity;
          } else {
            console.error(`Medicine not found for ID: ${item.medicine}`);
          }
        }
        req.body.profit = profit;
        console.log(req.body);

        // Generate the order number
        const orderNumber = await generateOrderNumber();
        req.body.orderNumber = orderNumber;

        const order = await Order.create(req.body);

        res.status(201).json({ success: true, data: order });
      } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: "Bad Request" });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method Not Allowed" });
      break;
  }
}
