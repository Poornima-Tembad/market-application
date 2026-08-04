import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

const HF_MODEL = 'microsoft/DialoGPT-medium';

async function callHuggingFace(messages, context) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `${context}\n\nUser: ${messages[messages.length - 1]?.content}\nAssistant:`;
    const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200, return_full_text: false } }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0]?.generated_text?.trim() : data.generated_text?.trim();
  } catch {
    return null;
  }
}

function localAIResponse(message, products, userProfile) {
  const lower = message.toLowerCase();

  if (lower.includes('compare') || lower.includes('difference')) {
    const names = products.slice(0, 2).map((p) => p.name).join(' vs ');
    return `I can help you compare fabrics. Based on our catalog, popular comparisons include ${names}. Would you like detailed specs on any specific fabrics?`;
  }

  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best')) {
    const recs = products.slice(0, 3);
    const list = recs.map((p) => `• **${p.name}** (${p.category}) — $${p.price}/${p.unit}`).join('\n');
    const pref = userProfile?.preferredFabricTypes?.length
      ? ` Based on your preference for ${userProfile.preferredFabricTypes.join(', ')},`
      : '';
    return `${pref} here are my top recommendations:\n\n${list}\n\nWould you like more details on any of these?`;
  }

  if (lower.includes('cotton')) {
    const cotton = products.filter((p) => p.tags?.includes('cotton') || p.category?.includes('Cotton'));
    if (cotton.length) {
      return `We have ${cotton.length} cotton fabrics available. Top picks: ${cotton.slice(0, 3).map((p) => p.name).join(', ')}. What's your intended use — apparel, home textiles, or industrial?`;
    }
  }

  if (lower.includes('silk') || lower.includes('linen') || lower.includes('wool')) {
    const type = ['silk', 'linen', 'wool'].find((t) => lower.includes(t));
    const matches = products.filter((p) => p.tags?.includes(type) || p.name.toLowerCase().includes(type));
    if (matches.length) {
      return `Found ${matches.length} ${type} options: ${matches.slice(0, 3).map((p) => `${p.name} ($${p.price}/${p.unit})`).join(', ')}.`;
    }
  }

  if (lower.includes('moq') || lower.includes('minimum order')) {
    return 'Most fabrics on TexTrade have MOQs between 50–500 meters. Check individual product pages for exact MOQ. What quantity are you looking to order?';
  }

  if (lower.includes('price') || lower.includes('budget') || lower.includes('cheap')) {
    const sorted = [...products].sort((a, b) => a.price - b.price);
    return `Budget-friendly options start at $${sorted[0]?.price}/${sorted[0]?.unit} for ${sorted[0]?.name}. Premium options go up to $${sorted[sorted.length - 1]?.price}/meter. What's your target price range?`;
  }

  if (lower.includes('stock') || lower.includes('available')) {
    const inStock = products.filter((p) => p.stock > 0);
    return `${inStock.length} of ${products.length} fabrics are currently in stock. I can filter by category or fabric type if you'd like.`;
  }

  return `I'm your TexTrade AI assistant. I can help you find fabrics, compare products, check availability, and recommend options based on your needs. Try asking "Recommend cotton fabrics for shirts" or "Compare silk options under $20/meter".`;
}

router.post('/chat', async (req, res) => {
  const { message, userProfile } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ message: 'Message required' });
  }

  const products = await Product.find({ isAvailable: true }).limit(50).lean();
  const productContext = products
    .slice(0, 20)
    .map((p) => `${p.name} (${p.category}, $${p.price}/${p.unit}, stock: ${p.stock})`)
    .join('; ');

  const context = `You are TexTrade AI, a B2B textile marketplace assistant. Available products: ${productContext}`;

  let reply = await callHuggingFace([{ content: message }], context);
  if (!reply) {
    reply = localAIResponse(message, products, userProfile);
  }

  const keywords = message.toLowerCase().split(/\s+/);
  const recommended = products
    .filter((p) =>
      keywords.some(
        (k) =>
          p.name.toLowerCase().includes(k) ||
          p.category.toLowerCase().includes(k) ||
          p.tags?.some((t) => t.includes(k))
      )
    )
    .slice(0, 4);

  const finalRecs = recommended.length ? recommended : products.filter((p) => p.isFeatured).slice(0, 4);

  res.json({
    reply,
    recommendations: finalRecs.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      unit: p.unit,
      images: p.images,
    })),
  });
});

router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query?.trim()) {
    return res.status(400).json({ message: 'Query required' });
  }

  const products = await Product.find({
    $or: [
      { $text: { $search: query } },
      { name: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
    ],
    isAvailable: true,
  }).limit(12);

  res.json({ products, interpretedQuery: query });
});

export default router;
