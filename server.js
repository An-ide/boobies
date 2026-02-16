const express = require('express');
const app = express();
const db = require('./db.json');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/data', (req, res) => {
  res.json(db);
});

app.get('/products', (req, res) => {
  res.json(db.products || []);
});

app.get('/categories', (req, res) => {
  res.json(db.categories || []);
});

app.get('/users', (req, res) => {
  res.json(db.users || []);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ API running on port ${port}`);
});