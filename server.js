const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(cors());

server.use(middlewares);

server.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`✅ JSON Server is running on port ${port}`);
  console.log(`📦 Database: db.json`);
  console.log(`🚀 API URL: http://localhost:${port}`);
});