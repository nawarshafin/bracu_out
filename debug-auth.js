require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function debugAuth() {
  console.log('🔍 Debugging Authentication Issues...\n');
  
  // Check environment variables
  console.log('1. Environment Variables:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
  console.log('   MONGODB_DB:', process.env.MONGODB_DB);
  console.log('   URI contains placeholders?', process.env.MONGODB_URI?.includes('YOUR_ACTUAL') ? 'YES - NEEDS TO BE UPDATED!' : 'NO');
  
  if (process.env.MONGODB_URI?.includes('YOUR_ACTUAL')) {
    console.log('\n❌ ERROR: You need to update your .env file with real MongoDB credentials!');
    console.log('Please replace YOUR_ACTUAL_USERNAME and YOUR_ACTUAL_PASSWORD with your real MongoDB Atlas credentials.');
    return;
  }
  
  try {
    // Test MongoDB connection
    console.log('\n2. Testing MongoDB Connection...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('   ✅ Connected to MongoDB successfully!');
    
    // Check database and collection
    const db = client.db(process.env.MONGODB_DB || 'BRACU_Out');
    const usersCount = await db.collection('users').countDocuments();
    console.log(`   📊 Found ${usersCount} users in the collection`);
    
    if (usersCount === 0) {
      console.log('   ⚠️  No users found in the collection!');
      await client.close();
      return;
    }
    
    // Get sample users
    console.log('\n3. Sample Users:');
    const users = await db.collection('users').find({}).limit(3).toArray();
    
    users.forEach((user, index) => {
      console.log(`   User ${index + 1}:`);
      console.log(`     Username: ${user.username || 'NOT SET'}`);
      console.log(`     Email: ${user.email || 'NOT SET'}`);
      console.log(`     Role: ${user.role || 'NOT SET'}`);
      console.log(`     Password length: ${user.password ? user.password.length : 0} characters`);
      console.log(`     Password format: ${user.password?.startsWith('$2b$') ? 'BCRYPT HASHED ✅' : 'PLAIN TEXT ❌'}`);
      console.log('');
    });
    
    // Test authentication logic
    if (users.length > 0) {
      console.log('4. Testing Authentication Logic:');
      const testUser = users[0];
      
      console.log(`   Testing with user: ${testUser.username}`);
      
      if (testUser.password?.startsWith('$2b$')) {
        console.log('   Password is hashed - testing with common passwords...');
        const commonPasswords = ['password', '123456', 'admin', testUser.username, 'test123'];
        
        for (const testPassword of commonPasswords) {
          const isValid = await bcrypt.compare(testPassword, testUser.password);
          if (isValid) {
            console.log(`   ✅ FOUND WORKING PASSWORD: "${testPassword}"`);
            break;
          }
        }
      } else {
        console.log('   ❌ Passwords are stored as plain text - they need to be bcrypt hashed!');
        console.log('   This is why authentication is failing.');
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 This means your MongoDB username/password in .env is wrong');
    } else if (error.message.includes('network')) {
      console.log('\n💡 This is a network connectivity issue');
    }
  }
}

// Run the debug
debugAuth().catch(console.error);
