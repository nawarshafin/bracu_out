import { testMongoConnection } from '../../lib/mongodb-test';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await testMongoConnection();
      
      if (result.success) {
        res.status(200).json({
          message: "MongoDB Atlas connection successful!",
          collections: result.collections,
          connectionString: process.env.MONGODB_URI ? "Connection string loaded ✅" : "Connection string not found ❌"
        });
      } else {
        res.status(500).json({
          message: "MongoDB connection failed",
          error: result.error
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error testing MongoDB connection",
        error: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
