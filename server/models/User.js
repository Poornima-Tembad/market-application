import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const buyerProfileSchema = new mongoose.Schema({
  businessType: String,
  industry: String,
  categoriesOfInterest: [String],
  preferredFabricTypes: [String],
  typicalOrderQuantity: String,
  budgetRange: String,
  preferences: String,
  onboardingComplete: { type: Boolean, default: false },
});

const supplierProfileSchema = new mongoose.Schema({
  businessName: String,
  businessType: String,
  contactPhone: String,
  businessAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  operatingHours: String,
  productCategories: [String],
  fabricTypes: [String],
  moq: Number,
  description: String,
  onboardingComplete: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['buyer', 'supplier'], required: true },
    avatar: String,
    buyerProfile: buyerProfileSchema,
    supplierProfile: supplierProfileSchema,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
