let orders = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { userId } = req.query;

  if (req.method === 'GET') {
    if (userId) {
      const userOrders = orders.filter(o => o.userId === parseInt(userId));
      res.status(200).json(userOrders);
    } else {
      res.status(200).json(orders);
    }
  }
  else if (req.method === 'POST') {
    const newOrder = { id: Date.now(), ...req.body };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}