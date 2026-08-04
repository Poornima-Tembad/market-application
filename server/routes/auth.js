import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '30d' });

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
    body('role').isIn(['buyer', 'supplier']).withMessage('Role must be buyer or supplier'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      buyerProfile: role === 'buyer' ? { onboardingComplete: false } : undefined,
      supplierProfile: role === 'supplier' ? { onboardingComplete: false } : undefined,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      buyerProfile: user.buyerProfile,
      supplierProfile: user.supplierProfile,
      token: generateToken(user._id),
    });
  }
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.matchPassword(req.body.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      buyerProfile: user.buyerProfile,
      supplierProfile: user.supplierProfile,
      token: generateToken(user._id),
    });
  }
);

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, buyerProfile, supplierProfile } = req.body;
  if (name) user.name = name;
  if (buyerProfile && user.role === 'buyer') {
    user.buyerProfile = { ...user.buyerProfile?.toObject?.() || user.buyerProfile, ...buyerProfile };
  }
  if (supplierProfile && user.role === 'supplier') {
    user.supplierProfile = { ...user.supplierProfile?.toObject?.() || user.supplierProfile, ...supplierProfile };
  }

  await user.save();
  res.json(user);
});

router.put('/onboarding/buyer', protect, async (req, res) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: 'Buyer only' });
  }

  const user = await User.findById(req.user._id);
  user.buyerProfile = { ...req.body, onboardingComplete: true };
  await user.save();
  res.json(user);
});

router.put('/onboarding/supplier', protect, async (req, res) => {
  if (req.user.role !== 'supplier') {
    return res.status(403).json({ message: 'Supplier only' });
  }

  const user = await User.findById(req.user._id);
  user.supplierProfile = { ...req.body, onboardingComplete: true };
  await user.save();
  res.json(user);
});

export default router;
