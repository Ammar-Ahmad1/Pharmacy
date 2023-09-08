import { connectToDB } from '@config/database.js';
import Order from '@models/order.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query } = req;

  // Connect to the database
  await connectToDB();

  switch (method) {
    case 'GET':
      try {
        // Check if a user ID query parameter is provided
        if (query.userId) {
          // Retrieve orders for the specific user
          const orders = await Order.find({ user: query.userId })
          .populate('user') // Populate the 'user' field
          .populate('items'); // Populate the 'items' field (assuming it's a reference to the 'Medicine' model)
          res.status(200).json({ success: true, data: orders });
        } else {
          // If no user ID is provided, return all orders
          const orders = await Order.find({})
          .populate('user') // Populate the 'user' field
          .populate('items');
          res.status(200).json({ success: true, data: orders });
        }
      } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
      }
      break;
    case 'POST':
      try {
        // Create a new order
        console.log(req.body);

        const order = await Order.create(req.body);
        res.status(201).json({ success: true, data: order });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: 'Bad Request' });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
      break;
  }
}
