import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product');
  }
  return cart;
};

router.get('/', protect, authorize('buyer'), async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(cart);
});

router.post('/add', protect, authorize('buyer'), async (req, res) => {
  const { productId, quantity = 1, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (item) => item.product._id.toString() === productId && item.color === color
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, color });
  }

  await cart.save();
  const updated = await getOrCreateCart(req.user._id);
  res.json(updated);
});

router.put('/update', protect, authorize('buyer'), async (req, res) => {
  const { itemId, quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  if (quantity <= 0) {
    cart.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  const updated = await getOrCreateCart(req.user._id);
  res.json(updated);
});

router.delete('/remove/:itemId', protect, authorize('buyer'), async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items.pull(req.params.itemId);
  await cart.save();
  const updated = await getOrCreateCart(req.user._id);
  res.json(updated);
});

router.delete('/clear', protect, authorize('buyer'), async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
});

export default router;
