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

// Campo virtual para formatear la fecha en UTC-3
OrderSchema.virtual('timestampFormatted').get(function() {
    return this.timestamp.toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      //second: '2-digit',
      hour12: false
    }).replace(',', '').replaceAll('/', '-') + ' hs';
  });

// Habilitar los campos virtuales en el JSON de salida
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

export const OrderModel = model('order', OrderSchema);