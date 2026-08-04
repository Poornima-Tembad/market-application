import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  color: String,
  unit: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      company: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      phone: String,
    },
    subtotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'ready_for_dispatch', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  { timestamps: true }
);

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `TX-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
