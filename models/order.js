import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema({
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Medicine', // Reference to the Medicine model
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: Boolean,
        default: false
    },
    totalAmount: {
        type: String
    }
});

const Order = models.Order || model('Order', orderSchema);

export default Order;
