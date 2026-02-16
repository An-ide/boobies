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
    } 
    else if (db && Array.isArray(db.products)) {
      products = db.products;
    } else {
      console.error('Unexpected db.json structure:', typeof db, db);
      return res.status(500).json({ 
        error: 'Invalid database structure',
        type: typeof db,
        isArray: Array.isArray(db)
      });
    }

    const categoriesSet = new Set();
    
    products.forEach(product => {
      if (product && typeof product.category === 'string' && product.category.trim() !== '') {
        categoriesSet.add(product.category.trim());
      }
    });

    const categories = Array.from(categoriesSet).sort((a, b) => a.localeCompare(b));

    res.status(200).json(categories);

  } catch (error) {
    console.error('Categories endpoint error:', error);
    
    res.status(500).json({ 
      error: 'Internal server error processing categories',
      message: error.message 
    });
  }
}