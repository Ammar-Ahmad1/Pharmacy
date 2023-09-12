import {Schema, model, models} from 'mongoose';
// Define a schema for order-related information, including the order number counter
const orderCounterSchema = new Schema({
  counter: {
    type: Number,
    default: 0,
  },
});

// Create a model for the order counter
const OrderCounter = models.OrderCounter || model('OrderCounter', orderCounterSchema);

export default OrderCounter;
