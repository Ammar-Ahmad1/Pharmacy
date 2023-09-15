import { Schema, model, models } from 'mongoose';

const orderItemSchema = new Schema({
    medicine: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine', // Reference to the Medicine model
    },
    quantity: {
        type: Number,
        default: 1, // Default quantity is 1, but you can change it as needed
    },
});

const orderSchema = new Schema({
    items: [orderItemSchema], // Embed order items as an array of objects
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    orderNumber: {
        type: String,
        unique: true,
    },

    address: {
        type: String,
    },
    city: {
        type: String,
    },
    date: {
        type: Date,
    },
    status: {
        type: Boolean,
        default: false,
    },
    totalAmount: {
        type: String,
    },
    profit: {
        type: Number, // Add a field to store the profit for the order
    },
    cancelled: {
        type: Boolean,
        default: false,
    },
});

const Order = models.Order || model('Order', orderSchema);

export default Order;
