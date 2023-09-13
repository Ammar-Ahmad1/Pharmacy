import { connectToDB } from '@config/database.js';
import Medicine from '@models/medicine.js';

export default async function handler(req, res) {
  const { method, query } = req;

  // Connect to the database
  await connectToDB();

  switch (method) {
    case 'DELETE':
      try {
        // Check if an order ID is provided in the query parameters
        if (!query.medicineId) {
          return res.status(400).json({ success: false, error: 'Medicine ID is required' });
        }

        // Find and delete the order by ID
        const deletedOrder = await Medicine.findByIdAndDelete(query.medicineId);

        if (!deletedOrder) {
          return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        res.status(200).json({ success: true, data: deletedOrder });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
      }
      break;
    default:
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
      break;
  }
}
