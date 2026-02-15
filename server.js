const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(cors());
server.use(middlewares);

server.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SpicX API is running',
    endpoints: {
      products: '/products',
      users: '/users',
      carts: '/carts'
    }
  });
});

server.use(router);

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`✅ JSON Server is running on port ${port}`);
});