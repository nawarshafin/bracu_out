const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugLogin() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'BRACU_Out';
  
  console.log('🐛 Login Authentication Debug');
  console.log('=' .repeat(50));
  
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('Users');
    
    console.log('✅ MongoDB Connected');
    console.log(`📊 Database: ${dbName}`);
    console.log(`🔗 Collection: Users`);
    
    // Get all users and show their current state
    const users = await usersCollection.find({}).toArray();
    console.log(`\n👥 Found ${users.length} users in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. EMAIL: ${user.email}`);
      console.log(`   NAME: ${user.name}`);
      console.log(`   ROLE: ${user.role}`);
      console.log(`   PASSWORD TYPE: ${user.password?.startsWith('$2b$') ? 'Bcrypt Hashed' : 'Plain Text'}`);
      console.log(`   PASSWORD LENGTH: ${user.password?.length || 0} characters`);
      console.log(`   HAS USERNAME FIELD: ${user.userName ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Test authentication manually step by step
    console.log('🧪 MANUAL AUTHENTICATION TESTS:\n');
    
    // Test cases with exact credentials
    const testCases = [
      { email: 'shafin@example.com', password: 'nawar123' },
      { email: 'akida@example.com', password: 'akida123' }
    ];
    
    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.email} with password "${testCase.password}"`);
      console.log('-' .repeat(40));
      
      // Step 1: Find user by email
      const foundUser = await usersCollection.findOne({ 
        email: testCase.email.toLowerCase() 
      });
      
      if (!foundUser) {
        console.log('❌ STEP 1: User not found in database');
        console.log(`   Searched for email: ${testCase.email.toLowerCase()}`);
        continue;
      }
      
      console.log('✅ STEP 1: User found in database');
      console.log(`   Found user: ${foundUser.name} (${foundUser.email})`);
      console.log(`   User role: ${foundUser.role}`);
      
      // Step 2: Check password format
      const isHashed = foundUser.password?.startsWith('$2b$') || 
                      foundUser.password?.startsWith('$2a$') || 
                      foundUser.password?.startsWith('$2y$');
      
      console.log(`✅ STEP 2: Password format detected`);
      console.log(`   Password type: ${isHashed ? 'Bcrypt hashed' : 'Plain text'}`);
      console.log(`   Stored password: ${foundUser.password?.substring(0, 10)}...`);
      
      // Step 3: Test password validation
      let isValidPassword = false;
      
      try {
        if (isHashed) {
          console.log('🔄 STEP 3: Testing bcrypt password comparison...');
          isValidPassword = await bcrypt.compare(testCase.password, foundUser.password);
          console.log(`   bcrypt.compare("${testCase.password}", storedHash) = ${isValidPassword}`);
        } else {
          console.log('🔄 STEP 3: Testing plain text password comparison...');
          isValidPassword = testCase.password === foundUser.password;
          console.log(`   "${testCase.password}" === "${foundUser.password}" = ${isValidPassword}`);
        }
      } catch (error) {
        console.log('❌ STEP 3: Password validation error');
        console.log(`   Error: ${error.message}`);
      }
      
      if (isValidPassword) {
        console.log('✅ STEP 3: Password validation SUCCESS');
        
        // Step 4: Create NextAuth user object
        const nextAuthUser = {
          id: foundUser._id?.toString() || foundUser.email,
          name: foundUser.name,
          userName: foundUser.userName || foundUser.email.split('@')[0],
          role: foundUser.role,
          email: foundUser.email
        };
        
        console.log('✅ STEP 4: NextAuth user object created');
        console.log('   User object:', JSON.stringify(nextAuthUser, null, 2));
        
        console.log('🎉 OVERALL RESULT: LOGIN SHOULD SUCCEED');
      } else {
        console.log('❌ STEP 3: Password validation FAILED');
        console.log('🚫 OVERALL RESULT: LOGIN WILL FAIL');
      }
      
      console.log('\\n' + '='.repeat(50) + '\\n');
    }
    
    // Check if there are any database connection issues
    console.log('🔧 SYSTEM DIAGNOSTICS:');
    console.log(`   MongoDB URI valid: ${uri ? 'Yes' : 'No'}`);
    console.log(`   Database accessible: Yes`);
    console.log(`   Collection accessible: Yes`);
    console.log(`   bcrypt module loaded: ${typeof bcrypt.compare === 'function' ? 'Yes' : 'No'}`);
    
    console.log('\\n💡 DEBUGGING TIPS:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Check Next.js terminal for server errors');
    console.log('3. Ensure you\'re using exact email/password combinations shown above');
    console.log('4. Try the plaintext password user: shafin@example.com / nawar123');
    
    return true;
    
  } catch (error) {
    console.error('\\n❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
    return false;
    
  } finally {
    await client.close();
    console.log('\\n🔐 Database connection closed');
  }
}

// Run the debug
debugLogin().then(success => {
  process.exit(success ? 0 : 1);
});
