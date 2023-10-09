// pages/api/orders/cancel/[orderId].js
import { connectToDB } from "@config/database.js";
import Order from "@models/order.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method, query } = req;

  // Connect to the database
  await connectToDB();

  switch (method) {
    case "PUT":
      try {
        const { orderId } = query;

        // Check if orderId is provided in the query parameters
        if (!orderId) {
          return res.status(400).json({ success: false, error: "Order ID is required" });
        }

        // Find the order by orderId
        const order = await Order.findById(orderId);
        
        // console.log(order);
        if (!order) {
          return res.status(404).json({ success: false, error: "Order not found" });
        }
       
          order.status = "Confirmed";
         // Save the updated order
        await order.save();

        // console.log(order);

        res.status(200).json({ success: true, message: "Status Updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server Error" });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method Not Allowed" });
      break;
  }
}
