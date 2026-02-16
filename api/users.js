const db = require('../db.json');

const users = [
  { id: 1, email: "admin@example.com", password: "admin123", role: "admin", isActive: true },
  { id: 2, email: "john@example.com", password: "password123", role: "user", isActive: true },
  { id: 7, email: "fds@gmail.com", password: "hhhhhh", role: "user", isActive: true }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { id, email, password, userId } = req.query;
    
    if (email && password) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
    else if (userId) {
      res.status(200).json([]);
    }
    else if (id) {
      const user = users.find(u => u.id === parseInt(id));
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
    else {
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.status(200).json(usersWithoutPasswords);
    }
  }
  else if (req.method === 'PATCH') {
    const { id } = req.query;
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex !== -1) {
      const updatedUser = { ...users[userIndex], ...req.body };
      users[userIndex] = updatedUser;
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}