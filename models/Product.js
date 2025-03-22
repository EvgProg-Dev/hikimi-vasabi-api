import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        composition: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        salePrice: {
            type: Number,
        },
        weight: {
            type: Number,
        },
        category: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        isNew: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", ProductSchema);
