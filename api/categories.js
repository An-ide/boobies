const db = require('../db.json');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let products = [];
    
    if (Array.isArray(db)) {
      products = db;
    } else if (db.products && Array.isArray(db.products)) {
      products = db.products;
    } else {
      return res.status(500).json({ error: 'Invalid database structure' });
    }

    const categories = [...new Set(
      products
        .map(p => p?.category)
        .filter(cat => cat && typeof cat === 'string')
    )];

    categories.sort((a, b) => a.localeCompare(b));

    res.status(200).json(categories);
  } catch (error) {
    console.error('Categories endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}