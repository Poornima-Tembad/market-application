import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1') });

const fabrics = [
  {
    name: 'Premium Egyptian Cotton Twill',
    category: 'Cotton',
    description: 'Luxurious long-staple Egyptian cotton twill with exceptional durability and a smooth hand feel. Ideal for premium shirting, uniforms, and corporate apparel.',
    images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Navy', hex: '#1e3a5f' }, { name: 'Sky Blue', hex: '#87CEEB' }],
    specifications: { composition: '100% Egyptian Cotton', weight: '200 GSM', width: '150 cm', weave: 'Twill', finish: 'Mercerized', origin: 'Egypt' },
    price: 8.50, stock: 5000, moq: 100, isFeatured: true, tags: ['cotton', 'premium', 'shirting'],
  },
  {
    name: 'Organic Linen Blend',
    category: 'Linen',
    description: 'Sustainable organic linen-cotton blend offering breathability and natural texture. Perfect for summer collections and eco-conscious brands.',
    images: ['https://images.unsplash.com/photo-1586075010923-2dd457fbfe83?w=600&q=80'],
    colors: [{ name: 'Natural', hex: '#F5F5DC' }, { name: 'Sage', hex: '#9CAF88' }],
    specifications: { composition: '55% Linen, 45% Organic Cotton', weight: '180 GSM', width: '140 cm', weave: 'Plain', finish: 'Soft Washed', origin: 'India' },
    price: 12.00, stock: 3200, moq: 50, isFeatured: true, tags: ['linen', 'organic', 'sustainable'],
  },
  {
    name: 'Mulberry Silk Charmeuse',
    category: 'Silk',
    description: 'Grade A mulberry silk charmeuse with lustrous sheen and fluid drape. The gold standard for luxury evening wear and high-end blouses.',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3d990?w=600&q=80'],
    colors: [{ name: 'Champagne', hex: '#F7E7CE' }, { name: 'Black', hex: '#000000' }, { name: 'Ruby', hex: '#9B111E' }],
    specifications: { composition: '100% Mulberry Silk', weight: '19 momme', width: '114 cm', weave: 'Charmeuse', finish: 'Satin', origin: 'China' },
    price: 28.00, stock: 800, moq: 30, isFeatured: true, tags: ['silk', 'luxury', 'evening-wear'],
  },
  {
    name: 'Merino Wool Gabardine',
    category: 'Wool',
    description: 'Fine merino wool gabardine with excellent wrinkle resistance. Perfect for tailored suits, blazers, and corporate wear.',
    images: ['https://images.unsplash.com/photo-1528459802006-039744903086?w=600&q=80'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#000080' }],
    specifications: { composition: '100% Merino Wool', weight: '280 GSM', width: '150 cm', weave: 'Gabardine', finish: 'Super 120s', origin: 'Italy' },
    price: 35.00, stock: 1500, moq: 50, isFeatured: true, tags: ['wool', 'tailoring', 'premium'],
  },
  {
    name: 'Recycled Polyester Performance',
    category: 'Synthetic',
    description: 'High-performance recycled polyester with moisture-wicking and quick-dry properties. Ideal for activewear and outdoor apparel.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    colors: [{ name: 'Black', hex: '#000' }, { name: 'Electric Blue', hex: '#0066CC' }],
    specifications: { composition: '100% Recycled Polyester', weight: '150 GSM', width: '160 cm', weave: 'Interlock', finish: 'Anti-microbial', origin: 'Taiwan' },
    price: 6.50, stock: 8000, moq: 200, isFeatured: false, tags: ['polyester', 'activewear', 'recycled'],
  },
  {
    name: 'Handloom Khadi Cotton',
    category: 'Cotton',
    description: 'Authentic hand-spun khadi cotton supporting artisan communities. Unique texture and heritage appeal for sustainable fashion brands.',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'],
    colors: [{ name: 'Off-White', hex: '#FAF0E6' }, { name: 'Indigo', hex: '#4B0082' }],
    specifications: { composition: '100% Hand-spun Cotton', weight: '120 GSM', width: '110 cm', weave: 'Handloom Plain', finish: 'Natural', origin: 'India' },
    price: 9.00, stock: 2000, moq: 50, isFeatured: true, tags: ['cotton', 'handloom', 'artisan'],
  },
  {
    name: 'Tencel Lyocell Jersey',
    category: 'Cellulosic',
    description: 'Soft Tencel lyocell jersey with superior moisture management and biodegradability. Excellent for base layers and casual wear.',
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'],
    colors: [{ name: 'Heather Grey', hex: '#B8B8B8' }, { name: 'Forest', hex: '#228B22' }],
    specifications: { composition: '100% Tencel Lyocell', weight: '160 GSM', width: '170 cm', weave: 'Single Jersey', finish: 'Enzyme Washed', origin: 'Austria' },
    price: 11.50, stock: 4500, moq: 100, isFeatured: false, tags: ['tencel', 'sustainable', 'jersey'],
  },
  {
    name: 'Denim Indigo Rigid',
    category: 'Denim',
    description: 'Classic 14oz rigid indigo denim for authentic jeans manufacturing. Develops beautiful fade patterns over time.',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
    colors: [{ name: 'Dark Indigo', hex: '#1a237e' }],
    specifications: { composition: '98% Cotton, 2% Elastane', weight: '14 oz', width: '150 cm', weave: '3x1 Right Hand Twill', finish: 'Raw/Rigid', origin: 'Japan' },
    price: 14.00, stock: 6000, moq: 200, isFeatured: true, tags: ['denim', 'jeans', 'indigo'],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/textile-marketplace';
  await mongoose.connect(uri);
  console.log('Connected for seeding...');

  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({}), Cart.deleteMany({})]);

  const supplier = await User.create({
    name: 'Global Textiles Co.',
    email: 'supplier@textrade.com',
    password: 'demo123',
    role: 'supplier',
    supplierProfile: {
      businessName: 'Global Textiles Co.',
      businessType: 'Manufacturer',
      contactPhone: '+1-555-0100',
      businessAddress: { street: '123 Fabric Lane', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400001' },
      operatingHours: 'Mon-Sat 9AM-6PM IST',
      productCategories: ['Cotton', 'Silk', 'Linen', 'Wool', 'Denim'],
      fabricTypes: ['Natural', 'Synthetic', 'Blended'],
      moq: 50,
      description: 'Leading B2B textile supplier serving global brands since 1995.',
      onboardingComplete: true,
    },
  });

  const buyer = await User.create({
    name: 'Fashion Forward Inc.',
    email: 'buyer@textrade.com',
    password: 'demo123',
    role: 'buyer',
    buyerProfile: {
      businessType: 'Brand/Retailer',
      industry: 'Fashion Apparel',
      categoriesOfInterest: ['Cotton', 'Silk', 'Linen'],
      preferredFabricTypes: ['Natural', 'Organic'],
      typicalOrderQuantity: '500-2000 meters',
      budgetRange: '$5-$20 per meter',
      onboardingComplete: true,
    },
  });

  const products = await Product.insertMany(
    fabrics.map((f) => ({
      ...f,
      slug: f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
      supplier: supplier._id,
      isAvailable: true,
    }))
  );

  await Order.create({
    buyer: buyer._id,
    supplier: supplier._id,
    items: [{
      product: products[0]._id,
      name: products[0].name,
      quantity: 500,
      price: products[0].price,
      unit: 'meter',
    }],
    shippingAddress: {
      company: 'Fashion Forward Inc.',
      street: '456 Design Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      phone: '+1-555-0200',
    },
    subtotal: 500 * products[0].price,
    status: 'preparing',
  });

  console.log('Seed complete!');
  console.log('Demo accounts:');
  console.log('  Buyer:    buyer@textrade.com / demo123');
  console.log('  Supplier: supplier@textrade.com / demo123');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
