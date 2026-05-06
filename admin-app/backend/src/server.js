const app = require('./app');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');
const seedAdmin = require('./seeders/adminSeeder');

const startServer = async () => {
  await connectDB();
  await seedAdmin(); // Run admin seeder after DB connection

  app.listen(PORT, () => {
    console.log(`🚀 Admin API running in ${NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
