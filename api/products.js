const db = require('../db.json');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    
    if (id) {
      const product = db.find(p => p.id === parseInt(id));
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } else {
      res.status(200).json(db);
    }
  } 
  else if (req.method === 'POST') {
    const newProduct = { id: Date.now(), ...req.body };
    res.status(201).json(newProduct);
  }
  else if (req.method === 'PATCH') {
    const { id } = req.query;
    const product = db.find(p => p.id === parseInt(id));
    if (product) {
      res.status(200).json({ id: parseInt(id), ...req.body });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}