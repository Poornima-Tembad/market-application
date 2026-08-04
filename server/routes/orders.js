import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('buyer'), async (req, res) => {
  const { shippingAddress, notes } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart?.items?.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const supplierGroups = {};
  for (const item of cart.items) {
    const supplierId = item.product.supplier.toString();
    if (!supplierGroups[supplierId]) supplierGroups[supplierId] = [];
    supplierGroups[supplierId].push(item);
  }

  const orders = [];
  for (const [supplierId, items] of Object.entries(supplierGroups)) {
    const orderItems = items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      color: item.color,
      unit: item.product.unit,
    }));

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      buyer: req.user._id,
      supplier: supplierId,
      items: orderItems,
      shippingAddress,
      subtotal,
      notes,
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    orders.push(order);
  }

  cart.items = [];
  await cart.save();

  res.status(201).json({ orders, message: 'Order placed successfully' });
});

router.get('/buyer', protect, authorize('buyer'), async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('supplier', 'name supplierProfile.businessName')
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/supplier', protect, authorize('supplier'), async (req, res) => {
  const orders = await Order.find({ supplier: req.user._id })
    .populate('buyer', 'name email buyerProfile')
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/supplier/stats', protect, authorize('supplier'), async (req, res) => {
  const supplierId = req.user._id;
  const [totalProducts, activeProducts, pendingOrders, recentOrders, lowStock] = await Promise.all([
    Product.countDocuments({ supplier: supplierId }),
    Product.countDocuments({ supplier: supplierId, isAvailable: true, stock: { $gt: 0 } }),
    Order.countDocuments({ supplier: supplierId, status: 'pending' }),
    Order.find({ supplier: supplierId }).sort({ createdAt: -1 }).limit(5).populate('buyer', 'name'),
    Product.find({ supplier: supplierId, stock: { $lt: 100 }, isAvailable: true }).limit(5),
  ]);

  res.json({ totalProducts, activeProducts, pendingOrders, recentOrders, lowStock });
});

router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('supplier', 'name supplierProfile.businessName')
    .populate('items.product');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSupplier = order.supplier._id.toString() === req.user._id.toString();
  if (!isBuyer && !isSupplier) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(order);
});

router.put('/:id/status', protect, authorize('supplier'), async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'preparing', 'ready_for_dispatch', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.supplier.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  order.status = status;
  await order.save();
  res.json(order);
});

export default router;
