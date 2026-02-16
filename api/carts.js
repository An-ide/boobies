let carts = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { userId } = req.query;

  if (req.method === 'GET') {
    if (userId) {
      const userCart = carts.find(c => c.userId === parseInt(userId));
      res.status(200).json(userCart ? [userCart] : []);
    } else {
      res.status(200).json(carts);
    }
  }
  else if (req.method === 'POST') {
    const newCart = { id: Date.now(), ...req.body };
    carts.push(newCart);
    res.status(201).json(newCart);
  }
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const cartIndex = carts.findIndex(c => c.id === parseInt(id));
    
    if (cartIndex !== -1) {
      carts[cartIndex] = { ...carts[cartIndex], ...req.body };
      res.status(200).json(carts[cartIndex]);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}