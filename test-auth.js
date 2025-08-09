const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('Testing MongoDB connection and authentication...');
  
  // You need to replace with your actual credentials
  const uri = "mongodb+srv://YOUR_ACTUAL_USERNAME:YOUR_ACTUAL_PASSWORD@cluster0.jxnswfw.mongodb.net/";
  const dbName = "BRACU_Out";
  
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db(dbName);
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`Found ${users.length} users in the collection:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
      console.log(`   Password starts with: ${user.password.substring(0, 10)}...`);
      console.log(`   Is password bcrypt hashed? ${user.password.startsWith('$2b$') ? 'YES' : 'NO'}`);
    });
    
    // Test password validation
    if (users.length > 0) {
      console.log('\n--- Testing Password Validation ---');
      const testUser = users[0];
      
      // Try validating with a test password (you should replace 'testpassword' with actual password)
      const testPassword = 'testpassword';
      
      if (testUser.password.startsWith('$2b$')) {
        const isValid = await bcrypt.compare(testPassword, testUser.password);
        console.log(`Testing password "${testPassword}" for user ${testUser.username}: ${isValid ? 'VALID' : 'INVALID'}`);
      } else {
        console.log('Passwords are stored as plain text - this needs to be bcrypt hashed!');
      }
    }
    
    await client.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAuth();
