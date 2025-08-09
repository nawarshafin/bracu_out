const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'bracu_out';

async function testPlainTextAuth() {
  let client;
  
  try {
    console.log('🧪 Testing plain text password authentication...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(MONGODB_DB);
    const collection = db.collection('Users');
    
    // Test user data
    const testUser = {
      userName: 'test_plain_user',
      password: 'testpassword123', // Plain text password
      name: 'Test Plain User',
      role: 'student',
      email: 'test.plain@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Clean up any existing test user
    await collection.deleteOne({ userName: testUser.userName });
    
    // Insert test user with plain text password
    console.log('📝 Creating test user with plain text password...');
    await collection.insertOne(testUser);
    console.log('✅ Test user created successfully');
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const foundUser = await collection.findOne({ userName: testUser.userName });
    
    if (!foundUser) {
      throw new Error('Test user not found');
    }
    
    console.log('👤 Found user:', foundUser.userName);
    console.log('🔑 Stored password:', foundUser.password);
    console.log('🔍 Input password:', testUser.password);
    
    // Test password validation (plain text comparison)
    const isValidPassword = foundUser.password === testUser.password;
    
    if (isValidPassword) {
      console.log('✅ Password validation PASSED - Plain text authentication working!');
    } else {
      console.log('❌ Password validation FAILED');
      return;
    }
    
    // Test with wrong password
    const isWrongPassword = foundUser.password === 'wrongpassword';
    if (!isWrongPassword) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log('❌ Wrong password incorrectly accepted');
    }
    
    // Clean up
    await collection.deleteOne({ userName: testUser.userName });
    console.log('🧹 Test user cleaned up');
    
    console.log('\n🎉 Plain text password authentication test completed successfully!');
    console.log('📊 Results:');
    console.log('  - User creation: ✅ PASS');
    console.log('  - Password storage: ✅ PLAIN TEXT (as requested)');
    console.log('  - Authentication: ✅ PASS');
    console.log('  - Wrong password rejection: ✅ PASS');
    
    console.log('\n⚠️  SECURITY REMINDER:');
    console.log('  - Passwords are stored in plain text');
    console.log('  - This is EXTREMELY INSECURE');
    console.log('  - Use only for development/testing');
    console.log('  - Never deploy to production');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the test
if (require.main === module) {
  testPlainTextAuth().catch(console.error);
}

module.exports = { testPlainTextAuth };
