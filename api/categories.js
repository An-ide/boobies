const db = require('../db.json');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'GET') {
    const categories = [...new Set(db.map(p => p.category))];
    res.status(200).json(categories);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}