import mongoose from "mongoose";
import autoIncrement from 'mongoose-sequence'

const OrderSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        orderItems: {
            type: Array,
            required: true,
        },
        comment: {
            type: String,
        },
        delivery: {
            type: String,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "new",
        },
    },

    {
        timestamps: true,
    }
);

OrderSchema.plugin(autoIncrement(mongoose), { inc_field: 'orderId', start_seq: 1 });

export default mongoose.model("Order", OrderSchema);
