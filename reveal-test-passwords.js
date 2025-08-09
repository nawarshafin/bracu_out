const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Common password patterns to test against hashed passwords
const commonPasswords = [
  'password',
  '123456',
  'password123',
  'admin',
  'test123',
  'user123',
  'akida123',
  'akida',
  'tasnim123',
  'tasnim',
  'nida123',
  'nida',
  'islam123',
  'islam',
  'faiyaz123',
  'faiyaz',
  'nawar123',
  'nawar',
  'shafin123',
  'shafin',
  'alumni123',
  'recruiter123',
  'graduate123',
  'student123',
  '12345678',
  'qwerty123',
  'abc123',
  'test',
  'demo123',
  'pass123'
];

async function revealTestPasswords() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'BRACU_Out';
  
  console.log('🔍 Revealing Test User Passwords');
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
    
    const users = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${users.length} users\n`);
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`${i + 1}. User: ${user.email} (${user.role})`);
      console.log(`   Name: ${user.name}`);
      
      if (user.password) {
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$') || user.password.startsWith('$2y$')) {
          console.log('   Password type: Bcrypt hashed');
          console.log('   🔍 Testing common passwords...');
          
          let foundPassword = false;
          for (const testPassword of commonPasswords) {
            try {
              const isMatch = await bcrypt.compare(testPassword, user.password);
              if (isMatch) {
                console.log(`   ✅ PASSWORD FOUND: "${testPassword}"`);
                foundPassword = true;
                break;
              }
            } catch (error) {
              // Continue to next password
            }
          }
          
          if (!foundPassword) {
            console.log('   ❌ Password not found in common list');
            console.log('   💡 Suggestions:');
            console.log(`      - Try: ${user.name.toLowerCase()}`);
            console.log(`      - Try: ${user.name.toLowerCase()}123`);
            console.log(`      - Try: ${user.email.split('@')[0]}`);
            console.log(`      - Try: ${user.email.split('@')[0]}123`);
          }
        } else {
          console.log(`   ✅ Plain text password: "${user.password}"`);
        }
      } else {
        console.log('   ❌ No password field');
      }
      console.log();
    }
    
    console.log('\n📝 Login Instructions:');
    console.log('=' .repeat(50));
    console.log('1. Start your Next.js app: npm run dev');
    console.log('2. Go to: http://localhost:3000/auth/login');
    console.log('3. For each user, try:');
    console.log('   - Email: [user email from above]');
    console.log('   - Password: [revealed password from above]');
    console.log('4. Should redirect to role-specific dashboard');
    
    console.log('\n🎯 Quick Test:');
    console.log('Try shafin@example.com with password "nawar123" - should work!');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Password revelation failed:', error.message);
    return false;
    
  } finally {
    await client.close();
    console.log('\n🔐 Database connection closed');
  }
}

// Run the test
revealTestPasswords().then(success => {
  process.exit(success ? 0 : 1);
});
