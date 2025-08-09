const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'BRACU_Out';

async function testDatabaseConnection() {
  console.log('🔍 Testing MongoDB connection and user data...\n');
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db(dbName);
    
    // List all collections
    console.log('\n📋 Listing all collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test Users collection
    console.log('\n👥 Fetching users from Users collection...');
    const usersCollection = db.collection('Users');
    const users = await usersCollection.find({}).toArray();
    
    if (users.length > 0) {
      console.log(`✅ Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
        console.log(`   Password: ${user.password}`);
      });
    } else {
      console.log('❌ No users found in Users collection');
    }
    
    console.log('\n🔚 Database connection test completed!');
    
  } catch (error) {
    console.error('❌ Error testing database connection:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🛠️  MongoDB Authentication Fix:');
      console.log('1. Verify your MongoDB connection string in .env');
      console.log('2. Check if the password is correct: nawar123');
      console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
    }
  } finally {
    await client.close();
  }
}

testDatabaseConnection();
