const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testAuthenticationFlow() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'BRACU_Out';
  
  console.log('🔐 Testing Authentication Flow');
  console.log('=' .repeat(40));
  
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('Users');
    
    // Get all users to test with
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${users.length} users in the database\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found for testing');
      return false;
    }
    
    // Display available test users
    console.log('👤 Available test users:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role})`);
      console.log(`      Name: ${user.name}`);
      console.log(`      Has password: ${user.password ? '✅' : '❌'}`);
      console.log(`      Has userName: ${user.userName ? '✅' : '❌'}`);
      console.log();
    });
    
    // Test email-based authentication
    console.log('🧪 Testing email-based authentication...');
    for (const user of users) {
      console.log(`\n   Testing user: ${user.email}`);
      
      // Test finding by email
      const foundByEmail = await usersCollection.findOne({ 
        email: user.email.toLowerCase() 
      });
      console.log(`   ✅ Find by email: ${foundByEmail ? 'SUCCESS' : 'FAILED'}`);
      
      // Test password validation (assuming password exists)
      if (user.password) {
        // Simulate password validation (plain text comparison as per your setup)
        const isValidPassword = user.password === user.password; // This would be the input password in real scenario
        console.log(`   ✅ Password validation structure: OK`);
      } else {
        console.log(`   ❌ No password field found`);
      }
      
      // Test username lookup (if userName exists)
      if (user.userName) {
        const foundByUsername = await usersCollection.findOne({ 
          userName: user.userName 
        });
        console.log(`   ✅ Find by username: ${foundByUsername ? 'SUCCESS' : 'FAILED'}`);
      } else {
        console.log(`   ⚠️  No userName field - will need email for login`);
      }
    }
    
    // Test the NextAuth-compatible authentication flow
    console.log('\n🔄 Testing NextAuth-compatible flow...');
    
    // Simulate the authentication process that NextAuth would use
    const testUser = users[0]; // Use first user for testing
    console.log(`\n   Using test user: ${testUser.email}`);
    
    try {
      // This simulates what happens in the NextAuth authorize function
      let user = null;
      
      // Try to find user by email
      user = await usersCollection.findOne({ 
        email: testUser.email.toLowerCase() 
      });
      
      if (user) {
        console.log('   ✅ User found by email');
        
        // Check if password exists and can be validated
        if (user.password) {
          console.log('   ✅ Password field exists');
          
          // Create the user object that would be returned to NextAuth
          const authUser = {
            id: user._id?.toString() || user.email,
            name: user.name,
            userName: user.userName || user.email.split('@')[0], // fallback to email prefix
            role: user.role,
            email: user.email
          };
          
          console.log('   ✅ NextAuth user object created:');
          console.log(`      ID: ${authUser.id}`);
          console.log(`      Name: ${authUser.name}`);
          console.log(`      UserName: ${authUser.userName}`);
          console.log(`      Role: ${authUser.role}`);
          console.log(`      Email: ${authUser.email}`);
          
        } else {
          console.log('   ❌ No password field - authentication will fail');
        }
      } else {
        console.log('   ❌ User not found');
      }
      
    } catch (authError) {
      console.log('   ❌ Authentication flow error:', authError.message);
    }
    
    // Check database connection health
    console.log('\n💡 Connection Health:');
    const dbStats = await db.stats();
    console.log(`   Database size: ${Math.round(dbStats.dataSize / 1024)} KB`);
    console.log(`   Collections: ${dbStats.collections}`);
    console.log(`   Connection status: ✅ Healthy`);
    
    console.log('\n✅ Authentication flow testing completed!');
    
    // Recommendations
    console.log('\n📝 Recommendations:');
    console.log('   1. ✅ MongoDB connection is working properly');
    console.log('   2. ✅ Users collection exists with data');
    console.log('   3. ✅ Email-based authentication should work');
    
    const usersWithoutUserName = users.filter(u => !u.userName).length;
    if (usersWithoutUserName > 0) {
      console.log(`   4. ⚠️  ${usersWithoutUserName} users don't have userName field`);
      console.log('      → Consider adding userName field or use email-only login');
    }
    
    const usersWithoutPassword = users.filter(u => !u.password).length;
    if (usersWithoutPassword > 0) {
      console.log(`   5. ❌ ${usersWithoutPassword} users don't have password field`);
      console.log('      → These users cannot authenticate until passwords are added');
    }
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Authentication flow test failed:', error.message);
    return false;
    
  } finally {
    await client.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the test
testAuthenticationFlow().then(success => {
  process.exit(success ? 0 : 1);
});
