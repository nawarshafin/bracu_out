const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'BRACU_Out';

async function testLogin() {
  console.log('🔐 Testing login functionality...\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('Users');

    const testUsers = [
      { email: 'akida@example.com', password: 'akida123', name: 'Akida' },
      { email: 'shafin@example.com', password: 'nawar123', name: 'Nawar' },
      { email: 'tasnim@example.com', password: 'nida123', name: 'Nida' },
      { email: 'islam@example.com', password: 'faiyaz123', name: 'faiyaz' }
    ];

    for (const testUser of testUsers) {
      try {
        console.log(`🧪 Testing login for ${testUser.name} (${testUser.email})...`);
        
        // Find user by email
        const user = await usersCollection.findOne({ email: testUser.email.toLowerCase() });
        
        if (!user) {
          console.log(`❌ User not found: ${testUser.email}\n`);
          continue;
        }
        
        console.log(`✅ User found: ${user.name} - ${user.role}`);
        
        // Test password validation
        const isValidPassword = await bcrypt.compare(testUser.password, user.password);
        
        if (isValidPassword) {
          console.log(`✅ Password validation successful for ${testUser.name}`);
          console.log(`   User ID: ${user._id}`);
          console.log(`   Role: ${user.role}`);
        } else {
          console.log(`❌ Password validation failed for ${testUser.name}`);
        }
        
        console.log('');
        
      } catch (error) {
        console.error(`❌ Error testing ${testUser.name}:`, error.message);
        console.log('');
      }
    }
    
    console.log('🔚 Login test completed!');
    
  } finally {
    await client.close();
  }
}

testLogin();
