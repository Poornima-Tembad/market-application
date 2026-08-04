import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

router.get('/', async (req, res) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    fabricType,
    inStock,
    featured,
    supplier,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }
  if (category && category !== 'all') filter.category = category;
  if (fabricType) filter.tags = { $in: [fabricType] };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (featured === 'true') filter.isFeatured = true;
  if (supplier) filter.supplier = supplier;

  const sortOptions = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name: { name: 1 },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('supplier', 'name supplierProfile.businessName')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

router.get('/categories', async (_req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

router.get('/featured', async (_req, res) => {
  const products = await Product.find({ isFeatured: true, isAvailable: true })
    .populate('supplier', 'name supplierProfile.businessName')
    .limit(8);
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'supplier',
    'name email supplierProfile'
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const similar = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isAvailable: true,
  }).limit(4);

  res.json({ product, similar });
});

router.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    'supplier',
    'name email supplierProfile'
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', protect, authorize('supplier'), async (req, res) => {
  const data = { ...req.body, supplier: req.user._id };
  if (!data.slug) data.slug = slugify(data.name) + '-' + Date.now().toString(36);
  const product = await Product.create(data);
  res.status(201).json(product);
});

router.put('/:id', protect, authorize('supplier'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.supplier.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

router.delete('/:id', protect, authorize('supplier'), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.supplier.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

router.get('/supplier/mine', protect, authorize('supplier'), async (req, res) => {
  const products = await Product.find({ supplier: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
});

export default router;
