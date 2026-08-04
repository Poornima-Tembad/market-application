import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    colors: [{ name: String, hex: String }],
    specifications: {
      composition: String,
      weight: String,
      width: String,
      weave: String,
      finish: String,
      origin: String,
    },
    price: { type: Number, required: true },
    unit: { type: String, default: 'meter' },
    stock: { type: Number, default: 0 },
    moq: { type: Number, default: 50 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [String],
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
