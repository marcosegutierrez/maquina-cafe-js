import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
    drink: {
        type: String,
        required: true
    },
    sugar: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now // Automático
    }
})

export const OrderModel = model('order', OrderSchema);